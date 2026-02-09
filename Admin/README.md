# Admin Panel

Admin dashboard for managing products and orders.

## Prerequisites
- Node.js 18+
- Backend running on `http://localhost:4000`

## Setup
```bash
cd Admin
npm install
```

## Environment
Create `Admin/.env`:
```
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_SERVER_URL=http://localhost:4000
```

## Run
```bash
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Features
- Product CRUD (image, sizes, description, stock)
- Orders view
