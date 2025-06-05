# ShinyLeaves Components Documentation

This document provides detailed information about the key components in the ShinyLeaves e-commerce application, their purpose, and how they interact with each other.

## Table of Contents

- [Overview](#overview)
- [Component Organization](#component-organization)
- [Core Components](#core-components)
- [Page Components](#page-components)
- [Reusable Components](#reusable-components)
- [Component Communication](#component-communication)
- [Styling and Theming](#styling-and-theming)

## Overview

ShinyLeaves follows Angular's component-based architecture, where the UI is composed of reusable, standalone components. Each component is responsible for a specific part of the user interface and encapsulates its own logic, template, and styles.

## Component Organization

The application organizes components into three main categories:

1. **Page Components**: Top-level components that correspond to routes in the application
2. **Reusable Components**: Smaller, reusable components that can be used across multiple pages
3. **Core Components**: Components that provide application-wide functionality

```
src/app/
├── components/           # Reusable components
│   ├── product-list/
│   ├── cart/
│   ├── product-card/
│   └── ...
├── pages/                # Page components
│   ├── login/
│   ├── register/
│   ├── checkout/
│   └── ...
└── core/                 # Core functionality
    ├── header/
    ├── footer/
    └── ...
```

## Core Components

### AppComponent

The root component that serves as the application shell. It includes the header, navigation, and main content area.

**Key features**:
- Manages the application layout
- Handles navigation drawer (sidebar)
- Controls authentication state display

**Usage example**:
```html
<!-- app.component.html -->
<mat-toolbar color="primary">
  <button mat-icon-button (click)="drawer.toggle()">
    <mat-icon>menu</mat-icon>
  </button>
  <span>ShinyLeaves</span>
  <span class="spacer"></span>
  <button mat-icon-button routerLink="/cart">
    <mat-icon>shopping_cart</mat-icon>
  </button>
  <button *ngIf="!isAuthenticated()" mat-button routerLink="/login">Login</button>
  <button *ngIf="isAuthenticated()" mat-button (click)="logout()">Logout</button>
</mat-toolbar>

<mat-sidenav-container>
  <mat-sidenav #drawer mode="side" closed>
    <!-- Navigation links -->
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```

### HeaderComponent

The application header that contains the logo, navigation links, and user controls.

**Key features**:
- Displays the application logo
- Provides navigation links
- Shows cart icon with item count
- Displays login/logout buttons based on authentication state

### FooterComponent

The application footer that contains links to legal pages and social media.

**Key features**:
- Displays copyright information
- Provides links to legal pages (Terms, Privacy Policy, Imprint)
- Shows social media links

## Page Components

### ProductListComponent

Displays a list of products with filtering and sorting options.

**Key features**:
- Fetches products from the ProductService
- Provides filtering by category, price range, etc.
- Implements sorting by price, popularity, etc.
- Handles pagination for large product lists

**Usage example**:
```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ProductCardComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      products => this.products = products
    );
  }
  
  // Filter and sort methods
}
```

### LoginComponent

Handles user authentication through a login form.

**Key features**:
- Provides form for email and password input
- Validates user input
- Submits credentials to AuthService
- Handles authentication errors
- Redirects to previous page after successful login

### CheckoutComponent

Manages the checkout process for completing purchases.

**Key features**:
- Displays order summary
- Collects shipping information
- Handles payment processing
- Shows order confirmation
- Protected by AuthGuard

## Reusable Components

### ProductCardComponent

Displays a single product with image, title, price, and action buttons.

**Key features**:
- Shows product information in a card layout
- Provides "Add to Cart" button
- Handles product image loading and errors

**Usage example**:
```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <mat-card>
      <img mat-card-image [src]="product.imageUrl" [alt]="product.name">
      <mat-card-content>
        <h2>{{product.name}}</h2>
        <p>{{product.price | currency}}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button (click)="addToCart()">Add to Cart</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 300px;
      margin: 16px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  
  constructor(private cartService: CartService) {}
  
  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
```

### CartItemComponent

Displays a single item in the shopping cart with quantity controls.

**Key features**:
- Shows product information
- Provides quantity adjustment controls
- Calculates item subtotal
- Allows item removal from cart

### AddressFormComponent

Reusable form for collecting shipping or billing address information.

**Key features**:
- Provides form fields for address information
- Validates address input
- Supports address saving for future use

## Component Communication

Components in ShinyLeaves communicate using several patterns:

1. **Parent-Child Communication**:
   - `@Input()` decorators for passing data from parent to child
   - `@Output()` decorators with EventEmitters for child-to-parent communication

2. **Service-based Communication**:
   - Shared services with observables for cross-component communication
   - Example: CartService for managing cart state across components

3. **Router State**:
   - URL parameters and query parameters for sharing state via the URL
   - Example: Product filtering parameters in the product list page

**Example of service-based communication**:
```typescript
// cart.service.ts
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  
  addToCart(product: Product): void {
    const currentItems = this.cartItems.getValue();
    // Add logic to add product to cart
    this.cartItems.next([...currentItems, { product, quantity: 1 }]);
  }
}

// product-card.component.ts
export class ProductCardComponent {
  @Input() product!: Product;
  
  constructor(private cartService: CartService) {}
  
  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}

// cart.component.ts
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  
  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(
      items => this.cartItems = items
    );
  }
}
```

## Styling and Theming

ShinyLeaves uses Angular Material for UI components and implements a consistent styling approach:

1. **Global Styles**:
   - Defined in `styles.css` for application-wide styling
   - Includes theme configuration, typography, and global CSS variables

2. **Component-specific Styles**:
   - Each component has its own CSS file for component-specific styling
   - Uses Angular's view encapsulation to prevent style leakage

3. **Theming**:
   - Uses Angular Material's theming system
   - Defines primary, accent, and warn color palettes
   - Supports light and dark themes

**Example of theme configuration**:
```scss
// styles.scss
@use '@angular/material' as mat;

// Define the palettes
$primary: mat.define-palette(mat.$teal-palette, 700);
$accent: mat.define-palette(mat.$amber-palette, A200, A100, A400);
$warn: mat.define-palette(mat.$red-palette);

// Create the theme
$theme: mat.define-light-theme((
  color: (
    primary: $primary,
    accent: $accent,
    warn: $warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// Apply the theme
@include mat.all-component-themes($theme);
```

For more detailed information about specific components, refer to the component's source code and comments.
