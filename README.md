This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.











Da, clean professional README kudukuren — Coffee and Codes brand-la:

---

```markdown
# Aachari International Exim — Official Website

> Built by [Coffee and Codes](https://github.com/coffeeandcodes) — Web Development & AI Services, Chennai.

A full-stack export company website built with Next.js 14, Supabase, and Resend. Features product showcase, customer enquiry system, and admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| Auth | JWT (Custom) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Project Structure

```
aachari-international/
├── app/
│   ├── api/                    # API Routes
│   │   ├── categories/         # Category endpoints
│   │   ├── products/           # Product endpoints
│   │   ├── enquiries/          # Enquiry form endpoint
│   │   └── admin/              # Protected admin endpoints
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── jwt.ts                  # JWT helpers
│   └── resend.ts               # Email client
├── types/
│   └── index.ts                # TypeScript interfaces
├── middleware.ts                # Admin route protection
└── .env.local                  # Environment variables
```

---

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/[slug]` | Get single category |
| GET | `/api/products` | Get all products |
| GET | `/api/products/[slug]` | Get single product with specs and images |
| GET | `/api/products?category=slug` | Filter products by category |
| POST | `/api/enquiries` | Submit customer enquiry |

### Admin Routes (Protected — JWT Required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login — returns JWT token |
| GET | `/api/admin/enquiries` | Get all enquiries |
| PUT | `/api/admin/enquiries/[id]` | Update enquiry status |
| POST | `/api/admin/products` | Create new product |
| PUT | `/api/admin/products/[id]` | Update existing product |
| DELETE | `/api/admin/products/[id]` | Delete product |

---

## Database Schema

6 tables in Supabase PostgreSQL:

- `categories` — Product categories
- `products` — Main product table
- `product_images` — Multiple images per product
- `product_specs` — Key-value product specifications
- `enquiries` — Customer enquiry form submissions
- `admin_users` — Admin dashboard access

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Resend account

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/aachari-international.git
cd aachari-international
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment variables**
```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@aachari.com
```

**4. Setup database**

Run the SQL schema in your Supabase SQL editor:
```bash
# Copy contents of schema.sql and run in Supabase SQL Editor
```

**5. Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `JWT_SECRET` | Secret key for JWT signing |
| `RESEND_API_KEY` | Resend email service API key |
| `ADMIN_EMAIL` | Email to receive enquiry notifications |

---

## Development Status

- [x] Database schema design
- [ ] Supabase setup
- [ ] lib/supabase.ts
- [ ] lib/jwt.ts
- [ ] lib/resend.ts
- [ ] types/index.ts
- [ ] Categories API
- [ ] Products API
- [ ] Enquiries API
- [ ] Admin login API
- [ ] Admin products CRUD
- [ ] Admin enquiries management
- [ ] Middleware — admin protection
- [ ] Frontend — coming soon

---

## License

Private project — built and maintained by Coffee and Codes, Chennai.  
All rights reserved © 2025 Aachari International Exim Pvt. Ltd.
```

---

 