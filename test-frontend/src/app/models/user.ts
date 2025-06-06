// src/app/models/user.ts
export interface User {
  name: string;
  email: string;
  address: string;
  id?: number; // Customer ID from the backend
}
