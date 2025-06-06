import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Product} from '../models/product';
import {ProductService} from './product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  // Using BehaviorSubject to store the wishlist items
  private wishlistItems = new BehaviorSubject<Product[]>([]);

  constructor(private productService: ProductService) {
    // Initialize wishlist from localStorage if available
    this.loadWishlist();
  }

  /**
   * Get the wishlist items as an Observable
   */
  getWishlist(): Observable<Product[]> {
    return this.wishlistItems.asObservable();
  }

  /**
   * Add a product to the wishlist
   */
  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistItems.getValue();

    // Check if product is already in wishlist
    if (!currentWishlist.some(item => item.p_id === product.p_id)) {
      const newWishlist = [...currentWishlist, product];
      this.wishlistItems.next(newWishlist);
      this.saveWishlist(newWishlist);
    }
  }

  /**
   * Remove a product from the wishlist
   */
  removeFromWishlist(productId: number): void {
    const currentWishlist = this.wishlistItems.getValue();
    const newWishlist = currentWishlist.filter(item => item.p_id !== productId);
    this.wishlistItems.next(newWishlist);
    this.saveWishlist(newWishlist);
  }

  /**
   * Check if a product is in the wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistItems.getValue().some(item => item.p_id === productId);
  }

  /**
   * Save wishlist to localStorage
   * Note: We're only storing product IDs, not the full product objects
   */
  private saveWishlist(wishlist: Product[]): void {
    // Only store the product IDs in localStorage
    const wishlistIds = wishlist.map(item => item.p_id);
    localStorage.setItem('wishlistIds', JSON.stringify(wishlistIds));
  }

  /**
   * Load wishlist from localStorage and fetch product details from API
   */
  private loadWishlist(): void {
    try {
      // Get wishlist IDs from localStorage
      const wishlistIds: number[] = JSON.parse(localStorage.getItem('wishlistIds') || '[]');

      // If there are old-style wishlist items, migrate them
      const oldWishlist = localStorage.getItem('wishlist');
      if (oldWishlist) {
        const oldItems: { id: number; name: string; slug: string }[] = JSON.parse(oldWishlist);
        const oldIds = oldItems.map(item => item.id);

        // Merge old and new IDs
        const mergedIds = [...new Set([...wishlistIds, ...oldIds])];
        localStorage.setItem('wishlistIds', JSON.stringify(mergedIds));

        // Remove old wishlist format
        localStorage.removeItem('wishlist');

        // Use the merged IDs
        this.fetchProductsForWishlist(mergedIds);
      } else if (wishlistIds.length > 0) {
        // Fetch products for the wishlist IDs
        this.fetchProductsForWishlist(wishlistIds);
      } else {
        // If there are no wishlist items, initialize with an empty array
        this.wishlistItems.next([]);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage', error);
      // If there's an error, start with an empty wishlist
      this.wishlistItems.next([]);
    }
  }

  /**
   * Fetch product details for the given product IDs
   */
  private fetchProductsForWishlist(productIds: number[]): void {
    if (productIds.length === 0) {
      this.wishlistItems.next([]);
      return;
    }

    // Fetch all products and filter by the wishlist IDs
    this.productService.getProducts().pipe(
      map(products => products.filter(product => productIds.includes(product.p_id)))
    ).subscribe({
      next: (products) => {
        this.wishlistItems.next(products);
      },
      error: (error) => {
        console.error('Error fetching products for wishlist', error);
        this.wishlistItems.next([]);
      }
    });
  }
}
