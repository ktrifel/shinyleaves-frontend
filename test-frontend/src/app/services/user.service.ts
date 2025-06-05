// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly base = `${environment.apiUrl}/api/customers/me`;

  constructor(private readonly http: HttpClient) {}

  /** Gets the current user's profile from the backend */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.base);
  }

  /** Updates the current user's profile */
  updateUser(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(this.base, userData);
  }

  /** Updates the user's email separately */
  updateEmail(email: string): Observable<User> {
    return this.http.patch<User>(`${this.base}/email`, { email });
  }
}
