// src/app/models/product.ts

export interface Product {
  /** Primary key in deiner DB */
  p_id: number;

  /** Name des Produkts */
  name: string;

  /** Preis (float in der DB) */
  price: number;

  /** URL-friendly Slug */
  slug: string;

  /** Fremdschlüssel auf Wirkung (w_id) */
  w_id: number;
}
