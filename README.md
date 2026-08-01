# Mini Product + Cart Module

A full-stack MERN app: JWT auth, product catalog with search/filter/pagination,
and a per-user cart with add/remove/total.

## Structure
```
mini-cart-app/
├── server/   Node.js + Express + MongoDB API
└── client/   React (Vite) frontend
```

## 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your own values:
```
MONGO_URI=mongodb://localhost:27017/minicart
JWT_SECRET=some_long_random_string
PORT=5000
```

If you don't have MongoDB installed locally, use a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste its
connection string into `MONGO_URI` instead.

Seed the database with 15 sample products:
```bash
npm run seed
```

Start the API:
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

### Quick API test (via curl or Postman)
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login (copy the returned token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# List products
curl http://localhost:5000/api/products?page=1&limit=5

# Add to cart (replace TOKEN and PRODUCT_ID)
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":2}'

# View cart
curl http://localhost:5000/api/cart -H "Authorization: Bearer TOKEN"
```

## 2. Frontend Setup

In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Opens at `http://localhost:5173`.

The app expects the API at `http://localhost:5000/api` (set in
`src/api/axios.js` — change the `baseURL` there if your backend runs
elsewhere).

## 3. Using the App

1. Go to `/signup`, create an account (auto-logs you in).
2. Browse `/products` — try the search box and category dropdown, and
   page through results.
3. Click a product to open its detail page and "Add to Cart".
4. Go to `/cart` to view items, remove one, and see the computed total.
5. Logout clears the token; visiting `/products` while logged out
   redirects to `/login` (protected routing).

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Create account, returns JWT |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/products | No | List products (query: `search`, `category`, `page`, `limit`) |
| GET | /api/products/:id | No | Single product |
| POST | /api/cart | Yes | Add item / increase quantity |
| GET | /api/cart | Yes | Current user's cart + total |
| DELETE | /api/cart/:itemId | Yes | Remove one item from cart |

Send the JWT as `Authorization: Bearer <token>` for the cart routes.

## Notes / Design Choices

- Passwords hashed with bcrypt (10 salt rounds); JWT expires in 7 days.
- Cart is one document per user, with `items[]` holding a product
  reference and quantity — `:itemId` in the delete route refers to
  the cart sub-item's own `_id`, not the product's `_id`.
- Total is computed server-side in `GET /cart` by populating each
  item's product and summing `price * quantity`.
- Pagination uses `skip`/`limit`; search uses a case-insensitive
  regex on `name`; category filter is an exact match.
- Frontend keeps it functional per the assignment brief — Tailwind
  utility classes, no extra design polish.
