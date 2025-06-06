
import { Component, OnInit, OnDestroy, inject, HostListener  } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { MatCardModule }              from '@angular/material/card';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }              from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { Product }                    from '../../models/product';
import { ProductService }             from '../../services/product.service';
import { WishlistService }            from '../../services/wishlist.service';
import {MatTooltip} from '@angular/material/tooltip';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltip, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly wishlistService = inject(WishlistService);

  /** hier landen die vom Backend geladenen Produkte */
  products: Product[] = [];
  
  /** Gefilterte und sortierte Produkte */
  filteredProducts: Product[] = [];
  
  /** Aktuell angezeigte Produkte basierend auf productsPerPage */
  displayedProducts: Product[] = [];
  
  /** Tracking für Button-Feedback */
  addingToCart: { [key: number]: boolean } = {};
  addingToWishlist: { [key: number]: boolean } = {};

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

  // Timeout-IDs für bessere Kontrolle
  private hoverResetTimeout: any = null;
  private dropdownResetTimeout: any = null;

  // Pagination Properties
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit(): void {
    this.productService.getProducts()
      .subscribe({
        next: prods => {
          this.products = prods;
          this.filteredProducts = [...prods];
          this.calculateTotalPages();
          this.updateDisplayedProducts();
        },
        error: err => console.error('Fehler beim Laden der Produkte', err)
      });
  }

  ngOnDestroy(): void {
    this.clearAllTimeouts();
  }

  // Scroll-Event Listener
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollPosition > 300;
  }

  // Scroll-to-Top Funktion - EINFACH UND FUNKTIONAL
  scrollToTop(): void {
    console.log('Scroll button clicked!');
    
    // Direkter Scroll an den Anfang
    window.scrollTo(0, 0);
    
    console.log('Scrolled to top');
  }

  // Pagination Methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    // Sicherstellen dass currentPage nicht größer als totalPages ist
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  // Navigation Methods
  goToFirstPage(): void {
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
    }
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updateDisplayedProducts();
  }

  onPageChange(): void {
    const clickedSelect = event?.target as HTMLSelectElement;
    if (clickedSelect) {
      this.addIndividualSelectAnimation(clickedSelect);
    }
    this.updateDisplayedProducts();
  }

  // Page Array für Dropdown
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ORIGINAL Methoden wiederherstellen
  applySorting(): void {
    // Individuelle Select-Animation - nur der geklickte Button
    const clickedSelect = event?.target as HTMLSelectElement;
    if (clickedSelect) {
      this.addIndividualSelectAnimation(clickedSelect);
    }
    
    // Sortier-Logik...
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
    
    this.currentPage = 1; // Reset auf Seite 1 bei neuer Sortierung
    this.calculateTotalPages();
    this.updateDisplayedProducts();
    
    // Verzögerter Reset nach Auswahl
    setTimeout(() => {
      this.scheduleHoverReset(300);
    }, 100);
  }

  onProductsPerPageChange(): void {
    // Finde das geklickte Select-Element
    const clickedSelect = event?.target as HTMLSelectElement;
    if (clickedSelect) {
      this.addIndividualSelectAnimation(clickedSelect);
    }
    
    this.currentPage = 1; // Reset auf Seite 1 bei Änderung der Anzahl
    this.calculateTotalPages();
    this.updateDisplayedProducts();
    
    // Verzögerter Reset nach Auswahl
    setTimeout(() => {
      this.scheduleHoverReset(300);
    }, 100);
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
        id: product.p_id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: `assets/images/${product.slug}.png`
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

  // KOMPLETT ÜBERARBEITETE Hover-Logik
  onFilterRowMouseEnter(): void {
    console.log('Mouse Enter - Filter Controls');
    this.clearAllTimeouts();
    this.filterRowHovered = true;
    
    const filterControls = document.querySelector('.filter-controls') as HTMLElement;
    const filterControlsBottom = document.querySelector('.filter-controls-bottom') as HTMLElement;
    
    // Beide Filter-Bereiche behandeln
    [filterControls, filterControlsBottom].forEach(element => {
      if (element) {
        element.classList.remove('force-reset');
        element.classList.add('js-hover');
      }
    });
  }

  onFilterRowMouseLeave(): void {
    console.log('Mouse Leave - Filter Controls');
    // Nur zurücksetzen wenn keine Selects aktiv sind
    if (!this.sortSelectActive && !this.productsPerPageSelectActive) {
      this.scheduleHoverReset(300);
    }
  }

  // Select Focus Events - VERBESSERT
  onSortSelectFocus(): void {
    console.log('Sort Select Focus');
    this.clearAllTimeouts();
    this.sortSelectActive = true;
    this.filterRowHovered = true;
    
    this.applyActiveState();
  }

  onSortSelectBlur(): void {
    console.log('Sort Select Blur');
    this.sortSelectActive = false;
    
    // Verzögerter Reset um Zeit für andere Interaktionen zu geben
    this.scheduleDropdownReset(200);
  }

  onProductsPerPageSelectFocus(): void {
    console.log('Products Per Page Select Focus');
    this.clearAllTimeouts();
    this.productsPerPageSelectActive = true;
    this.filterRowHovered = true;
    
    this.applyActiveState();
  }

  onProductsPerPageSelectBlur(): void {
    console.log('Products Per Page Select Blur');
    this.productsPerPageSelectActive = false;
    
    // Verzögerter Reset um Zeit für andere Interaktionen zu geben
    this.scheduleDropdownReset(200);
  }

  // NEUE Methode für einheitliche Active-State Anwendung
  private applyActiveState(): void {
    const filterControls = document.querySelector('.filter-controls') as HTMLElement;
    const filterControlsBottom = document.querySelector('.filter-controls-bottom') as HTMLElement;
    
    [filterControls, filterControlsBottom].forEach(element => {
      if (element) {
        element.classList.remove('force-reset');
        element.classList.add('js-hover', 'dropdown-active');
      }
    });
  }

  // VERBESSERTE Timeout-Methoden
  private clearAllTimeouts(): void {
    if (this.hoverResetTimeout) {
      clearTimeout(this.hoverResetTimeout);
      this.hoverResetTimeout = null;
    }
    if (this.dropdownResetTimeout) {
      clearTimeout(this.dropdownResetTimeout);
      this.dropdownResetTimeout = null;
    }
  }

  private scheduleHoverReset(delay: number): void {
    this.clearAllTimeouts();
    
    this.hoverResetTimeout = setTimeout(() => {
      this.checkAndReset();
    }, delay);
  }

  private scheduleDropdownReset(delay: number): void {
    this.clearAllTimeouts();
    
    this.dropdownResetTimeout = setTimeout(() => {
      this.checkAndReset();
    }, delay);
  }

  // VERBESSERTE Reset-Prüfung
  private checkAndReset(): void {
    // Prüfe aktuelle DOM-Zustände
    const activeSelects = document.querySelectorAll('.filter-controls select:focus, .filter-controls-bottom select:focus');
    const isMouseOverFilter = document.querySelector('.filter-controls:hover, .filter-controls-bottom:hover');
    
    console.log('Check and Reset:', {
      activeSelects: activeSelects.length,
      sortSelectActive: this.sortSelectActive,
      productsPerPageSelectActive: this.productsPerPageSelectActive,
      isMouseOverFilter: !!isMouseOverFilter
    });
    
    // Reset nur wenn WIRKLICH nichts aktiv ist
    if (activeSelects.length === 0 && 
        !this.sortSelectActive && 
        !this.productsPerPageSelectActive && 
        !isMouseOverFilter) {
      this.resetHoverState();
    }
  }

  private resetHoverState(): void {
    console.log('Resetting Hover State');
    this.filterRowHovered = false;
    this.sortSelectActive = false;
    this.productsPerPageSelectActive = false;
    
    const filterControls = document.querySelector('.filter-controls') as HTMLElement;
    const filterControlsBottom = document.querySelector('.filter-controls-bottom') as HTMLElement;
    
    [filterControls, filterControlsBottom].forEach(element => {
      if (element) {
        // ALLE Klassen entfernen
        element.classList.remove('js-hover', 'dropdown-active', 'persistent-hover');
        element.classList.add('force-reset');
        
        // Force Reset nach kurzer Zeit entfernen
        setTimeout(() => {
          element.classList.remove('force-reset');
        }, 400);
      }
    });
  }

  // Add individual select animation method
  private addIndividualSelectAnimation(selectElement: HTMLSelectElement): void {
    selectElement.classList.add('select-clicked');
    setTimeout(() => {
      selectElement.classList.remove('select-clicked');
    }, 200);
  }

  /**
   * Add a product to the wishlist
   */
  addToWishlist(product: Product): void {
    // Button-Feedback starten
    this.addingToWishlist[product.p_id] = true;

    // Add to wishlist
    this.wishlistService.addToWishlist(product);

    // Button-Feedback nach 800ms zurücksetzen
    setTimeout(() => {
      this.addingToWishlist[product.p_id] = false;
    }, 800);
  }

  /**
   * Check if a product is in the wishlist
   */
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}
