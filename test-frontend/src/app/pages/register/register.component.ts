import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule     } from '@angular/material/input';
import { MatButtonModule    } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    name:     ['', Validators.required],
    address:  ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  register(): void {
    if (this.form.invalid) return;

    const userData = this.form.getRawValue();
    console.log('Registrierung erfolgreich:', userData);
    this.router.navigateByUrl('/login');
  }
}
