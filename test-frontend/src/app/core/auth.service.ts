/*  src/app/core/auth.service.ts  */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly demo = { email: 'demo@shinyleaves.de', password: 'demo123' };

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  private readonly base = '/api/auth';

  register(data: any) {
    return this.http.post(`${this.base}/register`, data);
  }

  loginApi(data: Credentials) {
    return this.http.post(`${this.base}/login`, data);
  }

  login(credentials: Credentials): Observable<void> {
    return new Observable(observer => {
      if (credentials.email === this.demo.email && credentials.password === this.demo.password) {
        localStorage.setItem('token', 'demo-token-123');
        observer.next();
        observer.complete();
      } else {
        observer.error('Ungültige Anmeldedaten');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
