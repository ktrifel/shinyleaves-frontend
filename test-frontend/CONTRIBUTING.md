# Contributing to ShinyLeaves Frontend

Thank you for your interest in contributing to the ShinyLeaves e-commerce frontend! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

We expect all contributors to adhere to our Code of Conduct. Please be respectful and considerate of others when participating in this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/shinyleaves-frontend.git`
3. Add the upstream repository: `git remote add upstream https://github.com/original-organization/shinyleaves-frontend.git`
4. Install dependencies: `npm install`
5. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make sure you're working with the latest code:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

3. Make your changes and test them thoroughly

4. Commit your changes following the [commit guidelines](#commit-guidelines)

5. Push your branch to your fork: `git push origin your-branch`

6. Create a pull request from your fork to the main repository

## Coding Standards

We follow the [Angular Style Guide](https://angular.dev/style-guide) for this project. Additionally:

- Use TypeScript's strict mode
- Maintain 100% test coverage for new code
- Follow the existing project structure
- Use Angular Material components when possible
- Ensure responsive design for all UI components

### Naming Conventions

- **Components**: Use kebab-case for filenames and PascalCase for class names (e.g., `product-card.component.ts` with `ProductCardComponent` class)
- **Services**: Use camelCase for filenames and PascalCase for class names (e.g., `productService.ts` with `ProductService` class)
- **Interfaces**: Use PascalCase with 'I' prefix (e.g., `IProduct`)
- **Enums**: Use PascalCase (e.g., `OrderStatus`)

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

Example: `feat: add product filtering functionality`

## Pull Request Process

1. Ensure your code follows the coding standards
2. Update documentation if necessary
3. Include tests for new functionality
4. Make sure all tests pass: `ng test`
5. Fill out the pull request template completely
6. Request a review from at least one maintainer
7. Address any feedback from reviewers

## Testing

- Write unit tests for all new functionality
- Ensure existing tests pass with your changes
- Test your changes in different browsers (Chrome, Firefox, Safari, Edge)
- Test responsive behavior on different screen sizes

## Documentation

- Update the README.md if your changes affect the project setup or usage
- Document new components, services, or features
- Include JSDoc comments for public methods and interfaces
- Update any relevant documentation in the /docs directory

Thank you for contributing to ShinyLeaves Frontend!
