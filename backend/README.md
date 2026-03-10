# ShopEZ Backend API

This is the backend API for the ShopEZ E-Commerce application. It is built using Node.js, Express.js, and MongoDB.

## Features Let

- User authentication (JWT)
- Role-based access control (User and Admin)
- Product listing, searching, and management
- Shopping cart functionality
- Order processing and management

## Environment Variables

Make sure to create a `.env` file in the root directory and add the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Running the Application

1. Install dependencies
```bash
npm install
```

2. Run the server locally (with nodemon)
```bash
npm run dev
```

3. Run in production
```bash
npm start
```

## API Endpoints

### Auth
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get logged-in user profile (Requires token)

### Products
- `GET /products` - Get all products (supports `?keyword=` for search)
- `GET /products/:id` - Get a single product
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update a product (Admin only)
- `DELETE /products/:id` - Delete a product (Admin only)

### Cart
- `GET /cart` - View cart (Requires token)
- `POST /cart/add` - Add items to cart (Requires token)
- `DELETE /cart/remove/:id` - Remove an item from cart (Requires token)

### Orders
- `POST /orders` - Place an order (Requires token)
- `GET /orders/myorders` - Get current user's orders (Requires token)
- `GET /orders` - Get all orders (Admin only)
- `GET /orders/:id` - Get specific order by id (Requires token)
- `PATCH /orders/:id/status` - Update order status (Admin only)

## License
ISC
