/* ───────────────────────────────────
   src/app/components/cart/cart.component.ts
─────────────────────────────────── */
import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router }            from '@angular/router';
import { AuthService }       from '../../core/auth.service';

/** Ein Posten im Warenkorb */
interface CartItem {
  id:       number;
  name:     string;
  price:    number;   // € pro Stück
  quantity: number;
}

@Component({
  selector:   'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls:  ['./cart.component.css'],
  imports:    [CommonModule, CurrencyPipe]   // NgIf, NgFor, currency‑Pipe
})
export class CartComponent {

  private readonly router = inject(Router);
  private readonly auth   = inject(AuthService);

  /** Aktueller Warenkorb (aus LocalStorage) */
  cartItems: CartItem[] =
    JSON.parse(localStorage.getItem('cart') ?? '[]');

  /** Gesamtsumme in € */
  get totalPrice(): number {
    return this.cartItems
             .reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  /* ────────── Helfer ────────── */
  private save(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  /* ────────── Aktionen ────────── */
  increase(i: CartItem): void { i.quantity++;          this.save(); }
  decrease(i: CartItem): void {
    i.quantity > 1 ? i.quantity-- : this.remove(i);
    this.save();
  }
  remove(i: CartItem): void {
    this.cartItems = this.cartItems.filter(x => x !== i);
    this.save();
  }
  clear(): void { this.cartItems = []; this.save(); }

  /** Weiter → Checkout (nur wenn nicht leer) */
  goCheckout(): void {
    if (!this.cartItems.length) { return; }

    if (this.auth.isLogged()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(
        ['/login'], { queryParams: { redirect: 'checkout' } }
      );
    }
  }
}
