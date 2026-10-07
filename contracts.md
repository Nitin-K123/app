# Product Search India — API Contracts

## Overview
Backend is FastAPI + MongoDB (Motor). All routes are prefixed with `/api`.
IDs are UUID strings. Auth uses JWT (HS256) in `Authorization: Bearer <token>` header.

## Data stored in DB (replaces mock.js data where applicable)
- `users` – id, email, password_hash, name, role (buyer/seller), company, phone, city, state, created_at
- `suppliers` – id (= user_id for sellers), company, city, state, year_established, gst, annual_turnover, employees, certifications[], response_rate, response_time, rating, reviews, cover_image, logo_initial
- `products` – id, name, category, subcategory, price, unit, moq, brand, gst, hsn, city, state, description, images[] (base64 or urls), seller_id, verified, created_at
- `enquiries` – id, product_id, product_name, seller_id, buyer_name, buyer_email, buyer_phone, qty, message, created_at

Mock items still used client-side only for: trending brands, city list, trade leads (buy requirements feed), stats.

## Endpoints

### Auth
- `POST /api/auth/register` → body: {email, password, name, role, company?, phone?} → {token, user}
- `POST /api/auth/login`    → body: {email, password} → {token, user}
- `GET  /api/auth/me`       → header auth → {user}

### Products
- `GET  /api/products` → query: q, category, city, verified, min_price, max_price, sort, limit → [products]
- `GET  /api/products/{id}` → {product, seller}
- `POST /api/products` → auth seller → body product → product
- `DELETE /api/products/{id}` → auth owner → {ok}
- `GET  /api/products/mine` → auth seller → [products]
- `GET  /api/products/featured` → first 10 → [products]

### Suppliers
- `GET /api/suppliers/{id}` → {supplier, products, stats}

### Enquiries
- `POST /api/enquiries` → public → body: {product_id, buyer_name, buyer_email, buyer_phone, qty, message} → {ok}
- `GET  /api/enquiries/mine` → auth seller → [enquiries]

### Uploads
- `POST /api/uploads` → multipart form `file` → {url: "data:image/..;base64,...", size}
  - MVP: returns base64 data URL; frontend stores it directly in `product.images`.

### Seed
- `POST /api/seed` → (dev) populates demo users, suppliers, products if DB empty.

## Frontend changes
- Replace `localStorage` demo flows with `axios` to `${REACT_APP_BACKEND_URL}/api/...`.
- Keep `mock.js` only for static UI content (categories, trending brands, trade leads, cities, stats).
- `AuthContext` holds `{token, user}` – persisted to localStorage key `psi_auth`.
- `AddProduct` → drag-drop image upload (multi-file) using react-dropzone-free handler via `onDrop` on native div + file input. Uploads via `/api/uploads` and stores returned data URLs.
- `SupplierProfile` route at `/supplier/:id` fetches `/api/suppliers/{id}`.
- `ProductDetail`, `SearchResults`, `FeaturedProducts` fetch from backend; fallback to mock on error (defensive).

## Mock → Real mapping
| Was in mock.js                | Now from backend          |
|------------------------------|---------------------------|
| featuredProducts             | GET /api/products/featured |
| productDetails (seller/specs)| GET /api/products/{id}, GET /api/suppliers/{id} |
| psi_demo_products (localStorage) | GET /api/products/mine, POST /api/products |
| psi_user (localStorage)      | POST /api/auth/login, GET /api/auth/me |
