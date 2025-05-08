import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems = JSON.parse(localStorage.getItem('cart') ?? '[]');
  total = this.cartItems.reduce((sum: number, item: any) => sum + item.price, 0);

  clearCart() {
    this.cartItems = [];
    this.total = 0;
    localStorage.removeItem('cart');
  }
}
