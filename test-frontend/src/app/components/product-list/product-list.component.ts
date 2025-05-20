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

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe({
        next: prods => this.products = prods,
        error: err => console.error('Fehler beim Laden der Produkte', err)
      });
  }

  addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  }
}