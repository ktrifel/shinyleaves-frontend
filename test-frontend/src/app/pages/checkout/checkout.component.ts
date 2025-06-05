import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { OrderService, OrderItem } from '../../services/order.service';

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
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.initForm();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.initForm();
      }
    });
  }

  private loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') ?? '[]');
  }

  private initForm(): void {
    // Parse user data if available
    let firstName = '';
    let lastName = '';
    let email = '';
    let street = '';
    let zipCode = '';
    let city = '';

    if (this.currentUser) {
      // Split name into first and last name
      const nameParts = this.currentUser.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';

      // Use email from user data
      email = this.currentUser.email || '';

      // Try to parse address into components
      if (this.currentUser.address) {
        const addressParts = this.currentUser.address.split(',');
        if (addressParts.length >= 1) {
          street = addressParts[0].trim();
        }
        if (addressParts.length >= 2) {
          const zipCityParts = addressParts[1].trim().split(' ');
          if (zipCityParts.length >= 1) {
            zipCode = zipCityParts[0].trim();
          }
          if (zipCityParts.length >= 2) {
            city = zipCityParts.slice(1).join(' ').trim();
          }
        }
      }
    }

    this.checkoutForm = this.fb.group({
      firstName: [firstName, []],
      lastName: [lastName, []],
      email: [email, []],
      street: [street, []],
      zipCode: [zipCode, []],
      city: [city, []],
      country: ['DE', []],

      paymentMethod: ['paypal', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
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
    console.log('Form validity:', this.checkoutForm.valid);
    console.log('Form values:', this.checkoutForm.value);
    console.log('Form errors:', this.checkoutForm.errors);

    // Log individual field validity
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      console.log(`${key} validity:`, control?.valid);
      console.log(`${key} errors:`, control?.errors);
    });

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

    // Generate a unique order number
    const orderNumber = this.generateUniqueOrderNumber();

    // Map cart items to order items
    const orderItems: OrderItem[] = data.items.map(item => ({
      order_nr: orderNumber,
      p_id: item.id,
      amount: item.quantity
    }));

    if (orderItems.length === 1) {
      // If there's only one item, use createOrder
      this.orderService.createOrder(orderItems).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          this.handleSuccessfulOrder(data, orderNumber);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.handleOrderError(error, data, orderNumber);
        }
      });
    } else {
      // If there are multiple items, use createOrders
      this.orderService.createOrders(orderItems).subscribe({
        next: (responses) => {
          console.log('Orders created successfully:', responses);

          // Check if any of the orders failed but were saved locally
          const hasFailedOrders = responses.some(response => response.success === false);

          if (hasFailedOrders) {
            // Some orders failed but were saved locally
            this.handlePartialSuccess(data, orderNumber);
          } else {
            // All orders were successful
            this.handleSuccessfulOrder(data, orderNumber);
          }
        },
        error: (error) => {
          console.error('Error creating orders:', error);
          this.handleOrderError(error, data, orderNumber);
        }
      });
    }
  }

  /**
   * Handles a successful order
   * @param data The checkout data
   * @param orderNumber The order number
   */
  private handleSuccessfulOrder(data: CheckoutData, orderNumber: string): void {
    localStorage.removeItem('cart'); // Clear cart
    this.router.navigate(['/order-success'], {
      state: { orderData: data, orderNumber: orderNumber }
    });
  }

  /**
   * Handles a partially successful order (some items saved locally)
   * @param data The checkout data
   * @param orderNumber The order number
   */
  private handlePartialSuccess(data: CheckoutData, orderNumber: string): void {
    localStorage.removeItem('cart'); // Clear cart
    this.isProcessing = false;

    // Show a message to the user
    alert('Some items could not be processed due to a database connection issue. They have been saved locally and will be processed when the connection is restored.');

    // Navigate to the success page
    this.router.navigate(['/order-success'], {
      state: { orderData: data, orderNumber: orderNumber }
    });
  }

  /**
   * Handles an order error
   * @param error The error
   * @param data The checkout data
   * @param orderNumber The order number
   */
  private handleOrderError(error: any, data: CheckoutData, orderNumber: string): void {
    this.isProcessing = false;

    // Check if it's a database connection error
    if (error.message && error.message.includes('database')) {
      // Database connection error - order was saved locally
      localStorage.removeItem('cart'); // Clear cart

      // Show a message to the user
      alert(error.message);

      // Navigate to the success page
      this.router.navigate(['/order-success'], {
        state: { orderData: data, orderNumber: orderNumber }
      });
    } else {
      // Other error
      alert('There was an error processing your order. Please try again.');
    }
  }

  private markAllFieldsAsTouched(): void {
    console.log('Marking all fields as touched');
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
      console.log(`${key} touched:`, control?.touched);
    });
  }

  /**
   * Generates a unique order number
   * @returns A unique order number
   */
  private generateUniqueOrderNumber(): string {
    // Generate a random alphanumeric string
    const randomPart = Math.random().toString(36).substr(2, 9).toUpperCase();

    // Add a timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36).toUpperCase();

    return `${timestamp}-${randomPart}`;
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
