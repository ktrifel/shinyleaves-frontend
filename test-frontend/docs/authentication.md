# Authentication in ShinyLeaves

This document provides detailed information about the authentication implementation in the ShinyLeaves e-commerce application.

## Table of Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [Implementation Details](#implementation-details)
- [Token Management](#token-management)
- [Route Protection](#route-protection)
- [Security Considerations](#security-considerations)
- [Testing Authentication](#testing-authentication)

## Overview

ShinyLeaves uses JSON Web Tokens (JWT) for authentication. The authentication system allows users to register, log in, and access protected resources. It includes features like token refresh, secure storage, and route protection.

## Authentication Flow

1. **Registration**:
   - User submits registration form with email, password, and personal information
   - Backend validates the data and creates a new user account
   - Backend returns a JWT token upon successful registration
   - Frontend stores the token and redirects to the home page

2. **Login**:
   - User submits login form with email and password
   - Backend validates credentials and returns a JWT token
   - Frontend stores the token and redirects to the previous page or home page

3. **Authenticated Requests**:
   - JWT token is included in the Authorization header for all API requests
   - Backend validates the token and processes the request
   - If token is invalid or expired, backend returns 401 Unauthorized

4. **Token Refresh**:
   - When token is about to expire, frontend requests a new token
   - Backend validates the refresh token and issues a new access token
   - Frontend updates the stored token

5. **Logout**:
   - Frontend removes the stored token
   - User is redirected to the login page

## Implementation Details

### AuthService

The `AuthService` is responsible for handling authentication-related operations:

```typescript
// Simplified example of AuthService
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password })
      .pipe(
        map(response => {
          const user = this.handleAuthResponse(response);
          return user;
        })
      );
  }

  register(userData: RegisterData): Observable<User> {
    return this.http.post<AuthResponse>('/api/auth/register', userData)
      .pipe(
        map(response => {
          const user = this.handleAuthResponse(response);
          return user;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  // Additional methods for token management, user profile, etc.
}
```

### AuthGuard

The `AuthGuard` protects routes that require authentication:

```typescript
// Simplified example of AuthGuard
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Store the attempted URL for redirecting after login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
```

## Token Management

### Token Storage

The application stores the JWT token in the browser's localStorage:

```typescript
// Store token
private storeToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Retrieve token
private getToken(): string | null {
  return localStorage.getItem('auth_token');
}
```

### Token Decoding

The application decodes the JWT token to extract user information:

```typescript
private decodeToken(token: string): any {
  try {
    // Simple decoding without verification
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
}
```

### Token Expiration

The application checks token expiration and refreshes when needed:

```typescript
private isTokenExpired(): boolean {
  const token = this.getToken();
  if (!token) return true;
  
  const decoded = this.decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Check if the token is expired
  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expiryTime;
}
```

## Route Protection

Routes that require authentication are protected using the `AuthGuard`:

```typescript
const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  // Other protected routes
];
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production to protect data in transit
2. **XSS Protection**: Angular provides built-in protection against XSS attacks
3. **CSRF Protection**: Include CSRF tokens in requests if your backend requires them
4. **Token Storage**: Consider using HttpOnly cookies for token storage in production
5. **Token Expiration**: Use short-lived tokens with refresh token mechanism
6. **Error Handling**: Don't expose sensitive information in error messages

## Testing Authentication

### Unit Testing

Example of unit testing the AuthService:

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should authenticate user and store token on login', () => {
    const mockResponse = {
      token: 'mock-jwt-token',
      user: { id: 1, email: 'test@example.com' }
    };
    
    service.login('test@example.com', 'password').subscribe(user => {
      expect(user).toBeTruthy();
      expect(user.email).toBe('test@example.com');
    });
    
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
    
    // Verify token is stored
    expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
  });
});
```

### E2E Testing

Example of E2E testing the authentication flow:

```typescript
describe('Authentication', () => {
  it('should redirect to login page when accessing protected route', () => {
    cy.visit('/profile');
    cy.url().should('include', '/login');
  });
  
  it('should allow login with valid credentials', () => {
    cy.visit('/login');
    cy.get('[data-test=email-input]').type('user@example.com');
    cy.get('[data-test=password-input]').type('password123');
    cy.get('[data-test=login-button]').click();
    
    // Should redirect to home page after login
    cy.url().should('not.include', '/login');
    
    // Should have access to protected routes
    cy.visit('/profile');
    cy.url().should('include', '/profile');
  });
});
```
