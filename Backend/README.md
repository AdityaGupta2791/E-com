# Backend API

Express + MongoDB API for products, auth, cart, and orders.

## Prerequisites
- Node.js 18+
- MongoDB connection string

## Setup
```bash
cd Backend
npm install
```

## Environment
Create `Backend/.env` with:
```
PORT=4000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
# Cloudinary (set these in your deployment environment)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run
```bash
npm run dev
```

## Key Routes
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`
- `GET /api/v1/auth/me`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/cart/add`
- `PUT /api/v1/cart/item/:productId`
- `DELETE /api/v1/cart/item/:productId`
- `POST /api/v1/orders`
- `GET /api/v1/orders/user`
