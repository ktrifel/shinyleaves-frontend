import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../services/user.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { User } from '../../models/user';
import { Product } from '../../models/product';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  isEditing = false;
  editedUser: Partial<User> = {};

  wishlist: Product[] = [];
  wishlistLoading = true;

  /** Tracking für Button-Feedback */
  addingToCart: { [key: number]: boolean } = {};

  constructor(
    private userService: UserService,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadWishlist();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load profile. Please try again later.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  loadWishlist(): void {
    this.wishlistLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (products) => {
        this.wishlist = products;
        this.wishlistLoading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist', error);
        this.wishlistLoading = false;
        this.snackBar.open('Failed to load wishlist. Please try again later.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    // The wishlist will be updated automatically through the subscription
  }

  addToCart(product: Product): void {
    // Button-Feedback starten
    this.addingToCart[product.p_id] = true;

    // Implement add to cart functionality similar to product-list component
    const cart: any[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const idx = cart.findIndex(item => item.id === product.p_id);

    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        id:       product.p_id,
        name:     product.name,
        price:    product.price,
        quantity: 1,
        image:    `assets/images/${product.slug}.png`,
        slug:     product.slug
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    this.snackBar.open('Product added to cart!', 'Close', {
      duration: 3000
    });

    // Button-Feedback nach 800ms zurücksetzen
    setTimeout(() => {
      this.addingToCart[product.p_id] = false;

      // Remove the product from the wishlist after animation completes
      this.removeFromWishlist(product.p_id);
    }, 800);
  }

  startEditing(): void {
    if (this.user) {
      this.editedUser = { ...this.user };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedUser = {};
  }

  saveProfile(): void {
    if (!this.editedUser) return;

    this.isLoading = true;
    this.userService.updateUser(this.editedUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.isLoading = false;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating profile', error);
        this.isLoading = false;
        this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';  // Zeigt Ersatzbild an
  }
}
