import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.post(this.apiUrl, items);
  }
}
