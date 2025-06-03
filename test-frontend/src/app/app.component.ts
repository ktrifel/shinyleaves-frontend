import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/* ─ Angular‑Material Feature‑Pakete ─ */
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  // Warenkorb Badge-Zähler
  cartItemCount = 0;

  ngOnInit() {
    // Initial Badge aktualisieren
    this.updateCartBadge();
    
    // Bei Storage-Änderungen Badge aktualisieren
    window.addEventListener('storage', () => {
      this.updateCartBadge();
    });
    
    // Periodisch prüfen (falls localStorage direkt geändert wird)
    setInterval(() => {
      this.updateCartBadge();
    }, 1000);
  }

  private updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') ?? '[]');
    this.cartItemCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
}
