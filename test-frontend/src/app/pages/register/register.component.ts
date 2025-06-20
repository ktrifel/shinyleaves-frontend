import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule     } from '@angular/material/input';
import { MatButtonModule    } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf
  ]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    zipCode: ['', Validators.required],
    city: ['', Validators.required],
    streetAndNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });


  register(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const formData = this.form.getRawValue();

    // Combine the address fields into a single string
    const combinedAddress = `${formData.zipCode} ${formData.city}, ${formData.streetAndNumber}`;

    // Create the user data object with the combined address
    const userData = {
      name: formData.name,
      address: combinedAddress,
      email: formData.email,
      password: formData.password
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registrierung erfolgreich:', response);
        this.isLoading = false;
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error('Registrierung fehlgeschlagen:', error);
        this.errorMessage = error.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es später erneut.';
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
