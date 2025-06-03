// src/app/components/product-list/product-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, CurrencyPipe],
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

  addToCart(product: Product, event?: Event) {
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
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Bessere Event-Behandlung - sucht den Button
    if (event) {
      // Suche nach dem tatsächlichen Button (falls auf inneres Element geklickt)
      const button = (event.target as HTMLElement).closest('button') as HTMLButtonElement;
      
      if (button) {
        // Original-Werte speichern
        const originalText = button.textContent || button.innerText;
        
        // Verhindert mehrfache Ausführung
        if (button.disabled) return;
        
        // Nur Text ändern - Button-Hintergrund bleibt unverändert
        button.textContent = '✓ Hinzugefügt!';
        button.style.setProperty('color', '#4CAF50', 'important'); // Grüner Text
        button.style.setProperty('transform', 'scale(0.98)', 'important'); // Leichte Animation
        button.disabled = true;
        
        // Nach 1.2 Sekunden zurücksetzen
        setTimeout(() => {
          button.textContent = originalText;
          button.style.removeProperty('color');
          button.style.removeProperty('transform');
          button.disabled = false;
        }, 1200);
      }
    }
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }
}
