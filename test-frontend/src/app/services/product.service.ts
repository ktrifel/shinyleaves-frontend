// src/app/services/product.service.ts
import { Injectable }       from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { Observable }       from 'rxjs';
import { environment }      from '../../environments/environment';
import { Product }          from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly base = `${environment.apiUrl}/api/products`;

  constructor(private readonly http: HttpClient) {}

  /** holt alle Produkte vom Backend */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }
}
