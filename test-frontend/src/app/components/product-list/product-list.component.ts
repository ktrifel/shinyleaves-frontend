// src/app/components/product-list/product-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { MatCardModule }              from '@angular/material/card';
import { MatButtonModule }            from '@angular/material/button';

import { Product }                    from '../../models/product';
import { ProductService }             from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  /** hier landen die vom Backend geladenen Produkte */
  products: Product[] = [];
  
  /** Tracking für Button-Feedback */
  addingToCart: { [key: number]: boolean } = {};

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe({
        next: prods => this.products = prods,
        error: err => console.error('Fehler beim Laden der Produkte', err)
      });
  }

  addToCart(product: any) {
    // Button-Feedback starten
    this.addingToCart[product.p_id] = true;
    
    // Nutze p_id als eindeutige ID
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
        image:    `assets/images/${product.slug}.png`
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Button-Feedback nach 1.5 Sekunden zurücksetzen
    setTimeout(() => {
      this.addingToCart[product.p_id] = false;
    }, 1500);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';  // Zeigt Ersatzbild an
  }
}
