/* ───────────────────────────────────
   src/app/components/cart/cart.component.ts
─────────────────────────────────── */
import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Für ngModel hinzufügen
import { Router }            from '@angular/router';
import { AuthService }       from '../../core/auth.service';

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
  imports:    [CommonModule, CurrencyPipe, FormsModule] // FormsModule hinzufügen
})
export class CartComponent {

  private readonly router = inject(Router);
  private readonly auth   = inject(AuthService);

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
    this.save(); 
  }
  
  decrease(i: CartItem): void {
    i.quantity > 1 ? i.quantity-- : this.remove(i);
    this.save();
  }
  
  // Neue Methode für direkte Eingabe
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
    
    this.save();
  }
  
  remove(i: CartItem): void {
    this.cartItems = this.cartItems.filter(x => x !== i);
    this.save();
  }
  
  clear(): void { 
    this.cartItems = []; 
    this.save(); 
  }

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

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }
}
