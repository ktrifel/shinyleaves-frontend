import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule     } from '@angular/material/input';
import { MatButtonModule    } from '@angular/material/button';

import { AuthService } from '../../core/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // → Import everything needed for the template here
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ]

})



export class LoginComponent {

  /* Dependency‑Injection (standalone via `inject`) */
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  /** Reactive form with validation */
  form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  /** Error message for the template */
  error = '';

  /** Login‑Button */
  login(): void {

    /* Is the form completely filled out? */
    if (this.form.invalid) {
      this.error = 'Please fill out all required fields';
      return;
    }

    /* Retrieve secure values from the form */
    const { email, password } = this.form.getRawValue();

    /* Call Auth‑Service (returns a Promise) */
    // login.component.ts
this.auth.login({ email, password }).pipe().subscribe({
  next: () => this.router.navigateByUrl('/checkout'),
  error: () => this.error = 'Incorrect login credentials'
});

  }
}


