import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = [
    { name: 'T-Shirt', price: 19.99 },
    { name: 'Hose', price: 29.99 },
    { name: 'Schuhe', price: 39.99 }
  ];

  addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} wurde in den Warenkorb gelegt.`);
  }
}
