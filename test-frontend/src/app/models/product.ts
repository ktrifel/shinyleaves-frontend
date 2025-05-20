// src/app/models/product.ts
export interface Product {
  p_id:  number;  // Produkt-ID aus der DB
  name:  string;  // Name (varchar)
  price: number;  // Preis (float)
  slug:  string;  // URL-Slug
  w_id:  number;  // Fremd-/Werk-ID aus der DB
}
