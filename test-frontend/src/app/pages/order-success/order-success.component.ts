import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent {
  private router = inject(Router);
  orderNumber: string;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { orderNumber: string } || {};

    this.orderNumber = state.orderNumber || this.generateOrderNumber();
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const timestampPart = timestamp.slice(-4);
    const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${timestampPart}${randomPart}`;
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
