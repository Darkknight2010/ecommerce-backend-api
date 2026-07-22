# E-Commerce Backend API

A RESTful backend API for an e-commerce platform, supporting category and product management, a session-based shopping cart, and order checkout.

**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose

## Features

- Categories API — create, read, update, and delete product categories
- Products API — manage products with category references
- Cart API — add, update, and remove items from a session-based cart
- Orders API — checkout flow that converts a cart into an order

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm

## Installation

```bash
git clone https://github.com/Darkknight2010/ecommerce-backend-api/tree/feature/final-review
cd ecommerce-backend-api
npm install
```

Create a `.env` file in the root directory (see Environment Variables below), then run:

```bash
npm run seed
npm run dev
```

## Environment Variables

| Variable      | Description                          |
|---------------|---------------------------------------|
| `PORT`        | Port the server runs on (e.g. 3000)   |
| `MONGO_URI`   | MongoDB connection string             |

## API Endpoints

### Categories
| Method | URL                      | Description              |
|--------|---------------------------|---------------------------|
| GET    | /api/v1/categories         | Get all categories        |
| POST   | /api/v1/categories         | Create a new category     |
| PUT    | /api/v1/categories/:id     | Update a category         |
| DELETE | /api/v1/categories/:id     | Delete a category         |

### Products
| Method | URL                     | Description              |
|--------|--------------------------|---------------------------|
| GET    | /api/v1/products          | Get all products          |
| POST   | /api/v1/products          | Create a new product      |
| PUT    | /api/v1/products/:id      | Update a product          |
| DELETE | /api/v1/products/:id      | Delete a product          |

### Cart
| Method | URL                  | Description                   |
|--------|------------------------|---------------------------------|
| GET    | /api/v1/cart            | Get current cart                |
| POST   | /api/v1/cart            | Add item to cart                |
| PUT    | /api/v1/cart/:itemId    | Update item quantity            |
| DELETE | /api/v1/cart/:itemId    | Remove item from cart           |

### Orders
| Method | URL                | Description                        |
|--------|----------------------|---------------------------------------|
| GET    | /api/v1/orders         | Get all orders                        |
| POST   | /api/v1/orders         | Checkout — create an order from cart  |

## Project Structure

```
├── config/         # App configuration
├── controllers/    # Route handler logic for each resource
├── db/             # Database connection setup
├── middleware/     # Error handling, validation, sanitization
├── models/         # Mongoose schemas (Category, Product, Cart, Order)
├── routes/         # Express route definitions
├── utils/          # Helper functions
├── seed.js         # Database seed script
└── app.js          # App entry point
```