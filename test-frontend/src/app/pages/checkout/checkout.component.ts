import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
}

interface CheckoutData {
  items: CartItem[];
  totalAmount: number;
  billingAddress: any;
  shippingAddress?: any;
  paymentMethod: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  shippingCost = 7.99;
  isProcessing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.initForm();
  }

  private loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') ?? '[]');
  }

  private initForm(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      street: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', [Validators.required]],
      country: ['DE', [Validators.required]],
      
      differentShipping: [false],
      shippingFirstName: [''],
      shippingLastName: [''],
      shippingStreet: [''],
      shippingZipCode: [''],
      shippingCity: [''],
      
      paymentMethod: ['paypal', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });

    // Dynamische Validierung für Lieferadresse
    this.checkoutForm.get('differentShipping')?.valueChanges.subscribe(value => {
      const shippingFields = ['shippingFirstName', 'shippingLastName', 'shippingStreet', 'shippingZipCode', 'shippingCity'];
      
      if (value) {
        shippingFields.forEach(field => {
          this.checkoutForm.get(field)?.setValidators([Validators.required]);
        });
      } else {
        shippingFields.forEach(field => {
          this.checkoutForm.get(field)?.clearValidators();
        });
      }
      
      shippingFields.forEach(field => {
        this.checkoutForm.get(field)?.updateValueAndValidity();
      });
    });
  }

  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get vatAmount(): number {
    return (this.totalPrice + this.shippingCost) * 0.19;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      
      const checkoutData: CheckoutData = {
        items: this.cartItems,
        totalAmount: this.totalPrice + this.shippingCost,
        billingAddress: {
          firstName: this.checkoutForm.value.firstName,
          lastName: this.checkoutForm.value.lastName,
          email: this.checkoutForm.value.email,
          street: this.checkoutForm.value.street,
          zipCode: this.checkoutForm.value.zipCode,
          city: this.checkoutForm.value.city,
          country: this.checkoutForm.value.country
        },
        paymentMethod: this.checkoutForm.value.paymentMethod
      };

      if (this.checkoutForm.value.differentShipping) {
        checkoutData.shippingAddress = {
          firstName: this.checkoutForm.value.shippingFirstName,
          lastName: this.checkoutForm.value.shippingLastName,
          street: this.checkoutForm.value.shippingStreet,
          zipCode: this.checkoutForm.value.shippingZipCode,
          city: this.checkoutForm.value.shippingCity,
          country: this.checkoutForm.value.country
        };
      }

      // Simuliere Checkout-Prozess
      setTimeout(() => {
        this.processCheckout(checkoutData);
      }, 2000);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private processCheckout(data: CheckoutData): void {
    console.log('Checkout Data:', data);
    
    // Hier würde normalerweise der API-Call erfolgen
    // Für Demo: Erfolgreich abschließen
    localStorage.removeItem('cart'); // Warenkorb leeren
    this.router.navigate(['/order-success'], { 
      state: { orderData: data } 
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  backToCart(): void {
    this.router.navigate(['/cart']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/placeholder.jpg';
  }
}
