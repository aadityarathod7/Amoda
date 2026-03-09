# Amoda Candles — E-Commerce Website

A full-stack aesthetic scented candle e-commerce website. Orders are placed via **WhatsApp or Instagram DM** — no payment gateway required.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookie) |
| Images | Cloudinary |
| Deploy | Vercel (client) + Render/Railway (server) |

---

## Project Structure

```
amoda/
├── client/          # React frontend (Vite)
└── server/          # Express backend
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account

---

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

### 2. Configure Environment Variables

**Server** — create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/amoda
JWT_SECRET=your_super_secret_key_min_32_chars
ADMIN_EMAIL=admin@amoda.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
WHATSAPP_NUMBER=91XXXXXXXXXX
INSTAGRAM_USERNAME=your_candle_page
CLIENT_URL=http://localhost:5173
```

**Client** — create `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- 1 admin account (using `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- 6 sample candle products
- Default site settings (WhatsApp number, Instagram, tagline)

---

### 4. Run in Development

```bash
# Terminal 1 — Start backend
cd server && npm run dev

# Terminal 2 — Start frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin panel: http://localhost:5173/admin

---

## Features

### Storefront
- **Home** — Hero with glow CTA, featured candles, brand story, testimonial carousel, Instagram CTA
- **Shop** — Product grid with filter (scent, price, availability) and sort
- **Product Detail** — Image gallery, full details, related products, mobile sticky Buy Now bar
- **About** — Brand story, "Why Amoda" section, behind-the-scenes gallery
- **Contact** — Contact form + WhatsApp / Instagram quick links
- **FAQ** — Accordion-style Q&A

### Buy Now Flow
No payment gateway. When a customer clicks "Buy Now":
1. A beautiful modal opens with product summary
2. Two options: **WhatsApp** (pre-filled message) or **Instagram DM**
3. Customer is redirected to place the order via DM

### Admin Panel (`/admin`)
- **Dashboard** — Stats overview + recent inquiries
- **Product Manager** — Full CRUD with Cloudinary image upload
- **Stock Manager** — Inline stock updates, low-stock alerts
- **Inquiry Manager** — View, mark read/replied, delete, reply via email
- **Settings** — Update WhatsApp number, Instagram username, hero tagline, maintenance mode

---

## API Reference

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All active products (filter/sort/paginate) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Single product |
| GET | `/api/settings/public` | WhatsApp, Instagram, tagline |
| POST | `/api/contact` | Submit contact form |

### Admin (JWT protected)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/products/admin/all` | All products (incl. inactive) |
| POST | `/api/products/admin` | Create product |
| PUT | `/api/products/admin/:id` | Update product |
| DELETE | `/api/products/admin/:id` | Soft-delete product |
| PATCH | `/api/products/admin/:id/stock` | Quick stock update |
| POST | `/api/products/admin/upload` | Upload to Cloudinary |
| GET | `/api/contact/admin` | List inquiries |
| PATCH | `/api/contact/admin/:id` | Update inquiry status |
| DELETE | `/api/contact/admin/:id` | Delete inquiry |
| PUT | `/api/settings/admin` | Update site settings |

---

## Deployment

### Backend → Render / Railway

1. Push `server/` to a Git repo
2. Set all environment variables in the dashboard
3. Build command: *(none needed)*
4. Start command: `node server.js`
5. Copy the deployed URL (e.g. `https://amoda-api.onrender.com`)

### Frontend → Vercel

1. Push `client/` to a Git repo
2. Set environment variable:
   ```
   VITE_API_BASE_URL=https://amoda-api.onrender.com/api
   ```
3. Build command: `npm run build`
4. Output directory: `dist`

---

## Adding multer-storage-cloudinary

The upload middleware uses `multer-storage-cloudinary`. Install it:

```bash
cd server && npm install multer-storage-cloudinary
```

---

## Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Paste into `server/.env`
4. Images are stored in the `amoda-candles` folder automatically

---

## Colour Palette

| Name | Hex |
|---|---|
| Primary (gold) | `#D4A574` |
| Secondary (brown) | `#8B6F47` |
| Background | `#FDF8F3` |
| Text | `#2C2C2C` |
| Accent | `#E8D5C4` |

---

## License

MIT
