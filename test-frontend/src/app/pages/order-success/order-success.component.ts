import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="success-container">
      <div class="success-icon">✓</div>
      <h1>Vielen Dank für Ihre Bestellung!</h1>
      <p>Ihre Bestellung wurde erfolgreich aufgegeben und wird bearbeitet.</p>
      <div class="order-number">
        Bestellnummer: #{{ orderNumber }}
      </div>
      <button (click)="continueShopping()" class="continue-btn">
        Weiter einkaufen
      </button>
    </div>
  `,
  styles: [`
    .success-container {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .success-icon {
      font-size: 4rem;
      color: #508a62;
      margin-bottom: 2rem;
    }
    
    h1 {
      color: #508a62;
      margin-bottom: 1rem;
    }
    
    .order-number {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin: 2rem 0;
      font-weight: 600;
    }
    
    .continue-btn {
      background: #508a62;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 22px;
      font-weight: 700;
      cursor: pointer;
    }
  `]
})
export class OrderSuccessComponent {
  private router = inject(Router);
  
  orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
  
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}