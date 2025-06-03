// src/app/components/product-list/product-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // CurrencyPipe hinzugefügt
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, CurrencyPipe], // CurrencyPipe hinzugefügt
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  /** hier landen die vom Backend geladenen Produkte */
  products: Product[] = [];

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe({
        next: prods => this.products = prods,
        error: err => console.error('Fehler beim Laden der Produkte', err)
      });
  }

  addToCart(product: Product) {
    // Nutze p_id als eindeutige ID
    const cart: any[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const idx = cart.findIndex(item => item.id === product.p_id);

    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        id: product.p_id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: `assets/images/${product.slug}.png`,
        slug: product.slug
        // w_id entfernt
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }
}
