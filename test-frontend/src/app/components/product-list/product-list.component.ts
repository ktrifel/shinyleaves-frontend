// src/app/components/product-list/product-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  /** hier landen die vom Backend geladenen Produkte */
  products: Product[] = [];
  
  /** Gefilterte und sortierte Produkte */
  filteredProducts: Product[] = [];
  
  /** Aktuell angezeigte Produkte basierend auf productsPerPage */
  displayedProducts: Product[] = [];
  
  /** Tracking für Button-Feedback */
  addingToCart: { [key: number]: boolean } = {};

  // Filter und Sortierung
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  productsPerPage: number = 16;

  // Scroll-to-Top Button
  showScrollButton: boolean = false;

  // Neue Properties für persistenten Hover
  filterRowHovered: boolean = false;
  sortSelectActive: boolean = false;
  productsPerPageSelectActive: boolean = false;

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe({
        next: prods => {
          this.products = prods;
          this.filteredProducts = [...prods];
          this.updateDisplayedProducts();
        },
        error: err => console.error('Fehler beim Laden der Produkte', err)
      });
  }

  // Scroll-Event Listener
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollPosition > 300;
  }

  // Scroll-to-Top Funktion
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // FEHLENDE METHODE hinzufügen
  updateDisplayedProducts(): void {
    // Zeige nur die ersten X Produkte basierend auf productsPerPage
    this.displayedProducts = this.filteredProducts.slice(0, this.productsPerPage);
  }

  // Individuelle Select-Animation - nur der geklickte Button
  applySorting(): void {
    // Finde das geklickte Select-Element
    const clickedSelect = event?.target as HTMLSelectElement;
    if (clickedSelect) {
      this.addIndividualSelectAnimation(clickedSelect);
    }
    
    // Hover-State nach Auswahl entfernen
    setTimeout(() => {
      this.filterRowHovered = false;
      this.sortSelectActive = false;
    }, 300);
    
    if (!this.sortField) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = [...this.products].sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (this.sortField) {
          case 'price':
            valueA = a.price || 0;
            valueB = b.price || 0;
            break;
          case 'genetic':
            valueA = (a.genetic || '').toLowerCase();
            valueB = (b.genetic || '').toLowerCase();
            break;
          case 'thc':
            valueA = a.thc || 0;
            valueB = b.thc || 0;
            break;
          case 'cbd':
            valueA = a.cbd || 0;
            valueB = b.cbd || 0;
            break;
          default:
            return 0;
        }

        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    this.updateDisplayedProducts();
  }

  onProductsPerPageChange(): void {
    // Finde das geklickte Select-Element
    const clickedSelect = event?.target as HTMLSelectElement;
    if (clickedSelect) {
      this.addIndividualSelectAnimation(clickedSelect);
    }
    
    // Hover-State nach Auswahl entfernen
    setTimeout(() => {
      this.filterRowHovered = false;
      this.productsPerPageSelectActive = false;
    }, 300);
    
    this.updateDisplayedProducts();
  }

  // NEUE Methode für individuelle Select-Animation
  private addIndividualSelectAnimation(selectElement: HTMLSelectElement): void {
    selectElement.classList.add('updating');
    setTimeout(() => selectElement.classList.remove('updating'), 400);
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
    
    // Button-Feedback nach 800ms zurücksetzen
    setTimeout(() => {
      this.addingToCart[product.p_id] = false;
    }, 800);
  }

  onImgError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }

  // Filter Row Hover Management
  onFilterRowMouseEnter(): void {
    this.filterRowHovered = true;
  }

  onFilterRowMouseLeave(): void {
    // Nur entfernen wenn kein Select aktiv ist
    if (!this.sortSelectActive && !this.productsPerPageSelectActive) {
      this.filterRowHovered = false;
    }
  }

  // Select-spezifische Hover-Events
  onSortSelectFocus(): void {
    this.sortSelectActive = true;
    this.filterRowHovered = true;
  }

  onSortSelectBlur(): void {
    this.sortSelectActive = false;
    // Kurze Verzögerung für bessere UX
    setTimeout(() => {
      if (!this.productsPerPageSelectActive) {
        this.filterRowHovered = false;
      }
    }, 100);
  }

  onProductsPerPageSelectFocus(): void {
    this.productsPerPageSelectActive = true;
    this.filterRowHovered = true;
  }

  onProductsPerPageSelectBlur(): void {
    this.productsPerPageSelectActive = false;
    // Kurze Verzögerung für bessere UX
    setTimeout(() => {
      if (!this.sortSelectActive) {
        this.filterRowHovered = false;
      }
    }, 100);
  }
}
