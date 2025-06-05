import { Component, ViewChild } from '@angular/core';
import { RouterModule }         from '@angular/router';
import { CommonModule }         from '@angular/common';

/* ─ Angular‑Material Feature‑Pakete ─ */
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule }             from '@angular/material/toolbar';
import { MatIconModule }                from '@angular/material/icon';
import { MatListModule }                from '@angular/material/list';
import { MatButtonModule }              from '@angular/material/button';

/* ─ Services ─ */
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  /* Hier müssen alle Material‑Module stehen, die das Template benutzt */
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ]
})
export class AppComponent {
  title = 'test-frontend';
  @ViewChild('drawer') drawer!: MatSidenav;

  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}
