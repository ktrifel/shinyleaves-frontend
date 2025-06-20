/* ───────────────────────────────────
   src/app/components/cart/cart.component.ts
─────────────────────────────────── */
import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Für ngModel hinzufügen
import { Router }            from '@angular/router';
import { AuthService }       from '../../core/auth.service';
import { WishlistService }   from '../../services/wishlist.service';
import { MatSnackBar }       from '@angular/material/snack-bar';
import { MatIconModule }     from '@angular/material/icon';
import { Product }           from '../../models/product';

/** Ein Posten im Warenkorb */
interface CartItem {
  id:       number;
  name:     string;
  price:    number;   // € pro Stück (netto)
  quantity: number;
  image?:   string;   // Bild-URL
  slug?:    string;
}

@Component({
  selector:   'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls:  ['./cart.component.css'],
  imports:    [CommonModule, CurrencyPipe, FormsModule, MatIconModule] // MatIconModule hinzufügen
})
export class CartComponent {

  private readonly router = inject(Router);
  private readonly auth   = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly snackBar = inject(MatSnackBar);

  /** Aktueller Warenkorb (aus LocalStorage) */
  cartItems: CartItem[] =
    JSON.parse(localStorage.getItem('cart') ?? '[]');

  /** Gesamtsumme netto */
  get totalPrice(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  /** Gesamtsumme inkl. 19% MwSt. */
  get totalPriceInclVat(): number {
    return this.totalPrice * 1.19;
  }

  /** Enthaltene MwSt. */
  get vatAmount(): number {
    return this.totalPrice * 0.19;
  }

  /* ────────── Helfer ────────── */
  private save(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  /* ────────── Aktionen ────────── */
  increase(i: CartItem): void {
    i.quantity++;
    this.triggerSpecificPriceAnimation(i);
    this.save();
  }

  decrease(i: CartItem): void {
    if (i.quantity > 1) {
      i.quantity--;
      this.triggerSpecificPriceAnimation(i);
      this.save();
    } else {
      this.remove(i);
    }
  }

  onQuantityChange(i: CartItem): void {
    // Sicherstellen, dass die Menge mindestens 1 ist
    if (i.quantity < 1 || isNaN(i.quantity)) {
      i.quantity = 1;
    }

    // Maximale Menge begrenzen (optional)
    if (i.quantity > 999) {
      i.quantity = 999;
    }

    // Dezimalstellen entfernen (falls eingegeben)
    i.quantity = Math.floor(i.quantity);

    this.triggerSpecificPriceAnimation(i);
    this.save();
  }

  private triggerSpecificPriceAnimation(item: CartItem): void {
    // Nur den Preis des spezifischen Produkts animieren
    const itemIndex = this.cartItems.indexOf(item);
    const specificItemTotal = document.querySelector(`.cart-item:nth-child(${itemIndex + 1}) .item-total`);

    if (specificItemTotal) {
      specificItemTotal.classList.add('price-changed');
      setTimeout(() => specificItemTotal.classList.remove('price-changed'), 400);
    }

    // Gesamtsummen in der Sidebar animieren
    const summaryElements = document.querySelectorAll('.summary-line span, .total-price, .vat-info');
    summaryElements.forEach(element => {
      element.classList.add('price-changed');
      setTimeout(() => element.classList.remove('price-changed'), 400);
    });
  }

  remove(i: CartItem): void {
    const itemIndex = this.cartItems.indexOf(i);
    const itemElement = document.querySelector(`.cart-item:nth-child(${itemIndex + 1})`);

    if (itemElement) {
      // Lösch-Animation starten
      itemElement.classList.add('removing');

      // Nach Animation ausführen
      setTimeout(() => {
        this.cartItems = this.cartItems.filter(x => x !== i);
        this.save();

        // Verbesserte nach-oben Animation für verbleibende Items
        setTimeout(() => {
          const remainingItems = document.querySelectorAll('.cart-item:not(.removing)');
          remainingItems.forEach((item, index) => {
            // Gestaffelte Animation für smootheren Effekt
            setTimeout(() => {
              item.classList.add('moving-up');
              setTimeout(() => item.classList.remove('moving-up'), 400);
            }, index * 50);
          });
        }, 100);
      }, 500);
    } else {
      // Fallback ohne Animation
      this.cartItems = this.cartItems.filter(x => x !== i);
      this.save();
    }
  }

  clearCart(): void {
    // Alle Items mit Animation entfernen
    const items = document.querySelectorAll('.cart-item');

    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('removing');
      }, index * 100); // Gestaffelte Animation
    });

    // Nach Animation leeren
    setTimeout(() => {
      this.clear();
    }, items.length * 100 + 500);
  }

  clear(): void {
    this.cartItems = [];
    this.save();
  }

  /** Weiter → Checkout (nur wenn nicht leer) */
  goCheckout(): void {
    if (!this.cartItems.length) { return; }

    // Direkt zur Checkout-Seite ohne Anmeldepflicht
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }

  /**
   * Move an item from the cart to the wishlist
   */
  moveToWishlist(item: CartItem): void {
    // Generate a slug if it's missing
    let slug = item.slug;
    if (!slug) {
      // Create a slug from the item name (convert to lowercase, replace spaces with hyphens)
      slug = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // If the name doesn't produce a valid slug, use the item ID
      if (!slug) {
        slug = `product-${item.id}`;
      }
    }

    // Create a Product object from the CartItem
    const product: Product = {
      p_id: item.id,
      name: item.name,
      price: item.price,
      slug: slug,
      w_id: 0 // This is required by the Product interface, but we don't have it in CartItem
    };

    // Add to wishlist
    this.wishlistService.addToWishlist(product);

    // Show success message
    this.snackBar.open('Produkt wurde zur Merkliste hinzugefügt', 'Schließen', {
      duration: 3000
    });

    // Remove from cart
    this.remove(item);
  }

  /**
   * Check if an item is already in the wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
