// src/app/models/product.ts
export interface Product {
  p_id:    number;  // Produkt-ID aus der DB
  name:    string;  // Name (varchar)
  price:   number;  // Preis (float)
  slug:    string;  // URL-Slug
  w_id:    number;  // Fremd-/Werk-ID aus der DB
  genetic?: string; // Genetik (z.B. "Sativa-dominant Hybrid")
  thc?:    number;  // THC-Gehalt in %
  cbd?:    number;  // CBD-Gehalt in %
  effect?: string;  // Effekte (z.B. "Relaxed, Happy, Euphoric")
}
