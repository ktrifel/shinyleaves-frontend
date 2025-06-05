// src/app/models/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}
