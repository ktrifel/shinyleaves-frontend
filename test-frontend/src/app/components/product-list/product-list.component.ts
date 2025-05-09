import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = [
    {
      name: 'Shiny Blüte',
      aroma: 'Zitrus',
      wirkung: 'Entspannend',
      thc: '4%',
      cbd: '12%',
      preis: 9.99,
      menge: '10g'
    },
    {
      name: 'Hanföl Classic',
      aroma: 'Neutral',
      wirkung: 'Beruhigend',
      thc: '0.3%',
      cbd: '18%',
      preis: 12.49,
      menge: '30ml'
    },
    {
      name: 'Wachs Stark',
      aroma: 'Waldig',
      wirkung: 'Fokussierend',
      thc: '6%',
      cbd: '10%',
      preis: 14.95,
      menge: '5g'
    }
  ];

  addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} wurde dem Warenkorb hinzugefügt.`);
  }
}
