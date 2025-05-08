import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Shiny Plant 1',
      description: 'Eine glänzende Zimmerpflanze.',
      price: 19.99,
      image: 'assets/plant1.jpg'
    },
    {
      id: 2,
      name: 'Shiny Plant 2',
      description: 'Noch eine schöne Pflanze.',
      price: 24.99,
      image: 'assets/plant2.jpg'
    },
  ];

  getProducts(): Product[] {
    return this.products;
  }
}
