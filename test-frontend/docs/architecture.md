# ShinyLeaves Application Architecture

This document provides an overview of the ShinyLeaves e-commerce application architecture, explaining the organization, structure, and data flow within the application.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Module Organization](#module-organization)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Server Communication](#server-communication)
- [Authentication Flow](#authentication-flow)

## Overview

ShinyLeaves is built using Angular 19 with a component-based architecture. The application follows Angular best practices and is organized into feature modules with clear separation of concerns. It uses Angular Material for UI components and implements responsive design principles.

## Project Structure

The application follows a feature-based organization:

```
src/
├── app/
│   ├── components/       # Reusable UI components
│   ├── core/             # Core functionality (auth, guards, interceptors)
│   ├── models/           # TypeScript interfaces and classes
│   ├── pages/            # Page components for different routes
│   ├── services/         # Services for data fetching and business logic
│   ├── app.component.*   # Root component files
│   ├── app.config.ts     # Application configuration
│   └── app.routes.ts     # Application routing
├── assets/               # Static assets (images, icons, etc.)
└── environments/         # Environment configuration
```

## Module Organization

The application uses Angular's standalone components approach, which eliminates the need for NgModules. Each component declares its own dependencies through the `imports` array in its `@Component` decorator.

Key aspects of the module organization:

1. **Standalone Components**: All components are standalone and import their own dependencies
2. **Shared Functionality**: Common functionality is provided through services and utility functions
3. **Lazy Loading**: Routes can be configured for lazy loading to improve initial load time

## Data Flow

The application follows a unidirectional data flow pattern:

1. **User Interaction**: User interacts with the UI
2. **Component Event Handlers**: Component handles the event and calls appropriate service methods
3. **Services**: Services process the request, communicate with the backend API, and return data
4. **Component Update**: Component receives the data and updates its state
5. **UI Update**: Angular's change detection updates the UI based on the new state

## State Management

The application uses a combination of approaches for state management:

1. **Local Component State**: For UI-specific state that doesn't need to be shared
2. **Services with Observables**: For shared state that needs to be accessed by multiple components
3. **URL State**: For state that should be reflected in the URL (e.g., filters, pagination)

## Server Communication

The application communicates with the backend API using Angular's HttpClient:

1. **API Services**: Dedicated services for each API endpoint (ProductService, OrderService, etc.)
2. **Interceptors**: HTTP interceptors for adding authentication tokens, handling errors, etc.
3. **Models**: TypeScript interfaces that match the API response structure
4. **Error Handling**: Centralized error handling with user-friendly error messages

## Authentication Flow

The authentication flow is handled by the AuthService and protected by route guards:

1. **Login/Register**: User submits credentials through the login/register form
2. **Token Storage**: Upon successful authentication, the JWT token is stored (localStorage/sessionStorage)
3. **Route Protection**: AuthGuard protects routes that require authentication
4. **Token Refresh**: Automatic token refresh mechanism to maintain the session
5. **Logout**: Clears the stored token and redirects to the login page

For more detailed information about the authentication implementation, see [authentication.md](./authentication.md).
