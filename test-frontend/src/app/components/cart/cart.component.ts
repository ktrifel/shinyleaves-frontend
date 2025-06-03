/* ───────────────────────────────────
   src/app/components/cart/cart.component.ts
─────────────────────────────────── */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/** Ein Posten im Warenkorb */
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, CurrencyPipe, FormsModule]
})
export class CartComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  /** Aktueller Warenkorb (aus LocalStorage) */
  cartItems: CartItem[] = [];

  ngOnInit(): void {
    this.loadCart();
  }

  private loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') ?? '[]');
  }

  /** Gesamtsumme netto */
  get totalPrice(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  /** Enthaltene MwSt. */
  get vatAmount(): number {
    return this.totalPrice * 0.19;
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
  
  onQuantityChange(i: CartItem): void {
    if (i.quantity < 1 || isNaN(i.quantity)) {
      i.quantity = 1;
    }
    
    if (i.quantity > 999) {
      i.quantity = 999;
    }
    
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

  clearCart(event?: Event): void {
    // Warenkorb leeren
    this.cartItems = [];
    this.save();
    
    // Visuelle Bestätigung - Button wird kurz wie "Zur Kasse" Button in #508a62
    if (event && event.target) {
      const button = event.target as HTMLButtonElement;
      const originalText = button.textContent || button.innerText;
      const originalBg = getComputedStyle(button).backgroundColor;
      const originalColor = getComputedStyle(button).color;
      
      // Button kurz in "Zur Kasse" Farben ändern (#508a62)
      button.textContent = '✓ Geleert!';
      button.style.setProperty('background-color', '#508a62', 'important');  // Ihr grünes Theme
      button.style.setProperty('color', 'white', 'important');
      button.style.setProperty('transform', 'scale(0.98)', 'important');
      button.disabled = true;
      
      // Nach 1.5 Sekunden zurücksetzen
      setTimeout(() => {
        button.textContent = originalText;
        button.style.removeProperty('background-color');
        button.style.removeProperty('color');
        button.style.removeProperty('transform');
        button.disabled = false;
      }, 1500);
    }
  }

  goCheckout(): void {
    if (!this.cartItems.length) { return; }

    if (this.auth.isLogged()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirect: 'checkout' } });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }

  private save(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
