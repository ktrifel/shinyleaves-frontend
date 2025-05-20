// src/app/models/product.ts
export interface Product {
  p_id: number;
  name: string;
  price: number;
  slug: string;
  w_id: number;
  // optional, wenn du später direkt eine URL speicherst:
  // image?: string;
}
