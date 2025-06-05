import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderItem {
  c_id: number;
  p_id: number;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/api/order`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Creates a new order in the backend
   * @param items The items to order
   * @returns An observable of the order response
   */
  createOrder(items: OrderItem[]): Observable<any> {
    // Send each item as a separate request
    return this.http.post(this.apiUrl, items[0]);
  }

  /**
   * Creates multiple orders in the backend
   * @param items The items to order
   * @returns An observable that completes when all orders are created
   */
  createOrders(items: OrderItem[]): Observable<any[]> {
    // Create an array of observables, one for each item
    const requests = items.map(item => this.http.post(this.apiUrl, item));

    // Use forkJoin to wait for all requests to complete
    return forkJoin(requests);
  }
}
