/*  src/app/core/auth.service.ts  */
import { Injectable, inject } from '@angular/core';
import { HttpClient }         from '@angular/common/http';
import { Router }             from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  isLogged(): boolean {
    // Replace with actual logic to check if the user is logged in
    return !!localStorage.getItem('token');
  }
  /* ==== Abhängigkeiten ==================================================== */
  private readonly http   = inject(HttpClient);
  private readonly router = inject(Router);

  /* ==== Demo‑User (wird einmalig in localStorage angelegt) =============== */
  private readonly demo = { email: 'demo@shinyleaves.de', password: 'demo123' };

  constructor() {
    if (!localStorage.getItem('demoUser')) {
      localStorage.setItem('demoUser', JSON.stringify(this.demo));
    }
  }

  /* ==== REST‑API Aufrufe (falls Backend vorhanden) ======================= */
  private readonly apiUrl = 'http://localhost:8000/api';

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /** Beispiel‑API‑Login (würde echtes Token liefern) */
  loginApi(data: Credentials) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  /* ==== Demo‑Login ohne Backend ========================================== */
  login(credentials: Credentials): Observable<void> {
    const user  = JSON.parse(localStorage.getItem('demoUser')!);
    const valid = credentials.email === user.email &&
                  credentials.password === user.password;

    if (!valid) {
      return throwError(() => ({ message: 'Invalid credentials' }));
    }

    localStorage.setItem('token', 'logged-in');
    return of(void 0);                       // → einfach Observable zurückgeben
  }

  /* ==== Helfer =========================================================== */
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }
}
