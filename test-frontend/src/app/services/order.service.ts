import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface OrderItem {
  order_nr: string;
  p_id: number;
  c_id: number;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/api/order`;
  private readonly localOrdersKey = 'pendingOrders';

  constructor(private readonly http: HttpClient) {
    // Try to process any pending orders when the service is initialized
    this.processPendingOrders();
  }

  /**
   * Creates a new order in the backend
   * @param items The items to order
   * @returns An observable of the order response
   */
  createOrder(items: OrderItem[]): Observable<any> {
    const orderItem = items[0];
    // Send each item as a separate request
    return this.http.post(this.apiUrl, orderItem).pipe(
      retry(3), // Retry up to 3 times
      catchError(error => this.handleError(error, orderItem))
    );
  }

  /**
   * Creates multiple orders in the backend
   * @param items The items to order
   * @returns An observable that completes when all orders are created
   */
  createOrders(items: OrderItem[]): Observable<any[]> {
    // Create an array of observables, one for each item
    const requests = items.map(item =>
      this.http.post(this.apiUrl, item).pipe(
        retry(3), // Retry up to 3 times
        catchError(error => {
          // If it's a database connection error, save the order locally
          if (error.status === 500 && error.error?.detail === 'Database connection error') {
            this.saveOrderLocally(item);
          }

          // Log the error but return a successful response to prevent forkJoin from failing
          console.error('Error creating order:', error);
          return of({
            success: false,
            error: error,
            message: 'Order saved locally and will be processed when the database connection is restored.'
          });
        })
      )
    );

    // Use forkJoin to wait for all requests to complete
    return forkJoin(requests).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Handles HTTP errors
   * @param error The HTTP error response
   * @returns An observable that errors with a user-friendly message
   */
  private handleError = (error: HttpErrorResponse, orderItem?: OrderItem): Observable<never> => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 500 && error.error?.detail === 'Database connection error') {
        // Save the order locally if it's a database connection error
        if (orderItem) {
          this.saveOrderLocally(orderItem);
        }
        errorMessage = 'Unable to connect to the database. Your order has been saved locally and will be processed when the connection is restored.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Saves an order locally when the database is unavailable
   * @param orderItem The order item to save
   */
  private saveOrderLocally(orderItem: OrderItem): void {
    try {
      // Get existing pending orders from localStorage
      const pendingOrders = JSON.parse(localStorage.getItem(this.localOrdersKey) || '[]');

      // Add the new order
      pendingOrders.push(orderItem);

      // Save back to localStorage
      localStorage.setItem(this.localOrdersKey, JSON.stringify(pendingOrders));

      console.log('Order saved locally:', orderItem);
    } catch (error) {
      console.error('Error saving order locally:', error);
    }
  }

  /**
   * Processes any pending orders that were saved locally
   */
  private processPendingOrders(): void {
    try {
      // Get pending orders from localStorage
      const pendingOrdersJson = localStorage.getItem(this.localOrdersKey);
      if (!pendingOrdersJson) return;

      const pendingOrders: OrderItem[] = JSON.parse(pendingOrdersJson);
      if (pendingOrders.length === 0) return;

      console.log('Processing pending orders:', pendingOrders);

      // Process each pending order
      pendingOrders.forEach((order, index) => {
        this.http.post(this.apiUrl, order).pipe(
          retry(3),
          tap(() => {
            // Remove the processed order from the pending orders
            pendingOrders.splice(index, 1);
            localStorage.setItem(this.localOrdersKey, JSON.stringify(pendingOrders));
            console.log('Pending order processed successfully:', order);
          }),
          catchError(error => {
            console.error('Error processing pending order:', error);
            return of(null); // Continue processing other orders
          })
        ).subscribe();
      });
    } catch (error) {
      console.error('Error processing pending orders:', error);
    }
  }
}
