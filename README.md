# E-commerce Application with Java Backend and React Frontend

## Overview

This is an e-commerce application with a React frontend and a Java Spring Boot backend. The application supports cart functionality, product filtering, search, and checkout. It can use either the Java backend or Supabase as a fallback.

## Features

- **User Authentication**: Login and signup functionality with JWT tokens
- **Product Listing**: Grid-based display of products with filtering and sorting
- **Cart Management**: Add, remove, and update quantities of products in the cart
- **Checkout Process**: Complete the purchase with shipping and payment information
- **Backend Integration**: Uses Java Spring Boot backend with Supabase as a fallback

## Running the Application in GitHub Codespaces

### Prerequisites

- GitHub account
- GitHub Codespaces access

### Steps to Run the Application

1. **Open the Repository in GitHub Codespaces**

   - Navigate to the repository on GitHub
   - Click on the "Code" button
   - Select the "Codespaces" tab
   - Click on "Create codespace on main"

2. **Start the Java Backend**

   ```bash
   cd src/backend
   ./mvnw spring-boot:run
   ```

   The Java backend will start on port 8080. If you encounter permission issues with the Maven wrapper, run:

   ```bash
   chmod +x ./mvnw
   ./mvnw spring-boot:run
   ```

3. **Start the React Frontend (in a new terminal)**

   ```bash
   npm install
   npm run dev
   ```

   The React frontend will start on port 5173.

4. **Access the Application**

   - In GitHub Codespaces, a notification will appear with a link to the running application
   - Alternatively, click on the "Ports" tab in the bottom panel
   - Find port 5173 and click on the "Open in Browser" icon

## Testing the Application

### Default Login Credentials

- Email: user@example.com
- Password: password

### Testing Steps

1. **Login/Signup**
   - Click on the "Login" button in the top right corner
   - Enter your credentials or create a new account

2. **Browse Products**
   - Use the filter panel to filter products by category, price range, and rating
   - Use the search bar to search for specific products
   - Use the sort dropdown to sort products by newest, price, or popularity

3. **Add Products to Cart**
   - Click on the "Add to Cart" button on a product card
   - The cart preview will open automatically

4. **Manage Cart**
   - Update quantities using the "+" and "-" buttons
   - Remove items using the trash icon
   - Click "Checkout" to proceed to checkout

5. **Complete Checkout**
   - Enter shipping information
   - Select payment method
   - Click "Place Order" to complete the purchase

## Architecture

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- ShadCN UI components
- React Router for routing

### Backend
- Java Spring Boot
- Spring Security with JWT authentication
- Spring Data JPA for database access
- H2 in-memory database for development
- RESTful API endpoints

### Integration
- Frontend can work with either Java backend or Supabase
- Automatic fallback to Supabase if Java backend is unavailable
- JWT token-based authentication

## Troubleshooting

### Java Backend Issues

- If you encounter "Address already in use" errors, find and kill the process using port 8080:
  ```bash
  lsof -i :8080
  kill -9 <PID>
  ```

- If the backend fails to start due to Java version issues, ensure you're using Java 17 or higher:
  ```bash
  java -version
  ```

### Frontend Issues

- If you encounter dependency issues, try clearing the npm cache and reinstalling:
  ```bash
  npm cache clean --force
  rm -rf node_modules
  npm install
  ```

- If the frontend can't connect to the backend, check that the backend is running and the API_BASE_URL environment variable is set correctly.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh