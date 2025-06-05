# ShinyLeaves E-Commerce Frontend

This project is an Angular-based e-commerce frontend application for ShinyLeaves, providing a modern shopping experience for users. It was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Project Overview

ShinyLeaves is an e-commerce platform that allows users to:
- Browse products
- Add items to cart
- Complete checkout process
- Create and manage user accounts
- View order history

The application uses Angular Material for UI components and implements responsive design for optimal viewing on various devices.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.x or later recommended)
- npm (v9.x or later)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/shinyleaves-frontend.git
   cd shinyleaves-frontend/test-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Project Structure

The application follows a modular architecture:

- **components/** - Reusable UI components (product-list, cart, etc.)
- **core/** - Core functionality including authentication and guards
- **models/** - TypeScript interfaces and classes
- **pages/** - Page components for different routes
- **services/** - Services for data fetching and business logic

## Features

- **Product Browsing**: View and search for products
- **Shopping Cart**: Add, remove, and update quantities
- **User Authentication**: Register, login, and profile management
- **Checkout Process**: Complete purchases with shipping and payment information
- **Order Management**: View order history and status

## Building

To build the project for production, run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

The application can be deployed to various hosting platforms:

1. **Static hosting** (Netlify, Vercel, GitHub Pages):
   - Build the application with `ng build`
   - Deploy the contents of the `dist/` directory

2. **Server deployment**:
   - The application includes server-side rendering capabilities
   - Use `npm run serve:ssr:test-frontend` to run the SSR version

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular Material](https://material.angular.io/)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
