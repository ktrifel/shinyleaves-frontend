// src/app/components/product-list/product-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Product {
  name:    string;
  slug:    string;
  wirkung: string;
  aroma:   string;
  thc:     string;
  cbd:     string;
  menge:   string;
  preis:   number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [
    {
      name: 'Blue Dream',
      slug: 'bluedream',
      wirkung: 'Entspannend',
      aroma: 'Beerig',
      thc: '10.5%',
      cbd: '0.5%',
      menge: '10g',
      preis: 10.50
    },
    {
      name: 'OG Kush',
      slug: 'ogkush',
      wirkung: 'Beruhigend',
      aroma: 'Erdig',
      thc: '12%',
      cbd: '0.3%',
      menge: '10g',
      preis: 12.00
    },
    {
      name: 'Northern Lights',
      slug: 'northernlights',
      wirkung: 'Schlaffördernd',
      aroma: 'Kräuterig',
      thc: '15%',
      cbd: '0.2%',
      menge: '10g',
      preis: 11.75
    }
  ];

  addToCart(product: Product) {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  }
}
