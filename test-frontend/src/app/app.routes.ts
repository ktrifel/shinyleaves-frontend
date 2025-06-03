import { Routes, provideRouter } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { 
    path: 'products', 
    loadComponent: () => import('./components/product-list/product-list.component')
      .then(m => m.ProductListComponent) 
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart.component')
      .then(m => m.CartComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register.component')
      .then(m => m.RegisterComponent) 
  },
  { path: '**', redirectTo: '/products' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
};
