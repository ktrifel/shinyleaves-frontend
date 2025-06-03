import { Component, ViewChild } from '@angular/core';
import { RouterModule }         from '@angular/router';

/* ─ Angular‑Material Feature‑Pakete ─ */
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule }             from '@angular/material/toolbar';
import { MatIconModule }                from '@angular/material/icon';
import { MatListModule }                from '@angular/material/list';
import { MatButtonModule }              from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  /* Hier müssen alle Material‑Module stehen, die das Template benutzt */
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ]
})
export class AppComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  title: any;
}
