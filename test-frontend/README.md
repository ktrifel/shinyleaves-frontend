# ShinyLeaves Frontend

ShinyLeaves is an e-commerce application for cannabis/CBD products built with Angular. This frontend application provides a complete shopping experience with product browsing, cart management, checkout process, and user authentication.

## Project Overview

ShinyLeaves Frontend is a modern Angular application with the following features:
- Product browsing and filtering
- Shopping cart functionality
- User authentication (login/register)
- User profile management
- Checkout process
- Legal pages (Impressum, AGB, Datenschutz)

The application is designed to work with a backend API but also includes a demo mode that works without a backend.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19.2.10)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shinyleaves-frontend/test-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development Server

To start a local development server with API proxying, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Backend API

The application is configured to connect to a backend API at `http://127.0.0.1:8000`. If you're running the application in demo mode, you can use it without a backend as it includes fallback functionality.

### Demo User

For testing purposes, a demo user is automatically created:
- Email: demo@shinyleaves.de
- Password: demo123

## Project Structure

### Main Components
- **Product List**: Displays all available products
- **Product Detail**: Shows detailed information about a specific product
- **Cart**: Manages the shopping cart
- **Checkout**: Handles the checkout process
- **Header/Footer**: Navigation and site information

### Core Services
- **ProductService**: Fetches product data from the API
- **CartService**: Manages the shopping cart state using Angular signals
- **AuthService**: Handles user authentication and session management
- **UserService**: Manages user data and profile information

## Building

To build the project for production, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
