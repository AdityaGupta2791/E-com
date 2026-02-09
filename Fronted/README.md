# Frontend (Shop)

Customer‑facing storefront built with React + Vite + Tailwind.

## Prerequisites
- Node.js 18+
- Backend running on `http://localhost:4000`

## Setup
```bash
cd Fronted
npm install
```

## Environment
Create `Fronted/.env`:
```
VITE_API_BASE_URL=http://localhost:4000/api/v1
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

## Key Features
- Product catalog and product detail
- Cart with guest + authenticated sync
- Orders and checkout
- Size/stock/description support
