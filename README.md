# Maktba Store

Modern stationery e-commerce platform for Tunisia, built with a scalable Next.js App Router architecture and a production-grade PostgreSQL schema.

## Why this product direction

The reference sites show a few clear Tunisian market patterns:

- category-heavy browsing for school, office, paper, bagagerie, and bundle purchases
- TND pricing with quick visual trust signals
- phone-first ordering habits and strong cash-on-delivery expectations
- seasonal rentree logic, wholesale volume tiers, and repeated restocking behavior

This implementation upgrades those market signals into a cleaner B2C storefront with a private admin CMS, stronger data modeling, and analytics-ready business logic.

## Stack

- Next.js 16 App Router
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui
- Prisma ORM
- PostgreSQL
- NextAuth
- React Hook Form + Zod
- Zustand
- Recharts + shadcn chart wrappers
- TanStack Table

## Core capabilities

### Public storefront

- premium homepage tailored to Tunisian stationery shoppers
- searchable catalog with category filters
- category pages and rich product detail pages
- cart with bulk-aware pricing
- Tunisia-ready checkout with governorates and COD
- account overview and order history surfaces

### Admin dashboard

- overview KPIs for revenue, profit, orders, and stock alerts
- products management with live create/edit/delete APIs
- categories management
- inventory monitoring and low-stock watchlist
- orders tracking
- customers management
- suppliers visibility
- finance analytics and expense tracking
- reports view for performance summaries

## Database design

The Prisma schema includes the requested core entities and the commerce-specific extensions needed for a serious stationery platform:

- `users`, `roles`, `customers`, `addresses`
- `products`, `product_images`, `categories`, `brands`
- `suppliers`, `supplier_products`
- `inventory_logs`, `stock_movements`
- `orders`, `order_items`, `payments`, `expenses`
- `product_variants`, `product_price_tiers`
- NextAuth support tables: `accounts`, `sessions`, `verification_tokens`

Commerce logic covered in the schema:

- cost price, retail price, pack price
- bulk quantity pricing tiers
- minimum order quantity
- supplier cost tracking
- stock movement history
- profit estimation fields on orders
- soft delete support on operational entities
- indexes on high-traffic lookup paths

## Project structure

```text
src/
  app/
    (store)/
      page.tsx
      catalog/
      categories/
      products/
      cart/
      checkout/
      account/
    admin/
    api/
  components/
    admin/
    forms/
    layout/
    shared/
    store/
    tables/
    ui/
  data/
    demo-store.ts
  lib/
    auth.ts
    demo-data.ts
    env.ts
    format.ts
    navigation.ts
    prisma.ts
    wholesale.ts
  store/
    cart-store.ts
prisma/
  schema.prisma
  seed.ts
```

## Environment variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/maktba_wholesale?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
DEMO_ADMIN_EMAIL="admin@maktba.tn"
DEMO_ADMIN_PASSWORD="ChangeMe123!"
```

## Local setup

```bash
npm install
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run db:push
npm run db:migrate
npm run db:seed
```

## Demo access

- Admin: `admin@maktba.tn` / `ChangeMe123!`
- Manager: `manager@maktba.tn` / `Manager123!`

Only `ADMIN` can access `/admin`. Middleware and server-side role checks redirect non-admin users away from dashboard routes.

## Seed data included

The seed and demo dataset contain realistic Tunisian stationery examples:

- school supplies
- office supplies
- paper and printing products
- creative kits
- bagagerie
- promotional packs
- Tunisian suppliers
- customer and admin records
- orders, payments, expenses, and stock activity

## Verification completed

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Notes

- The UI runs fully with the included demo dataset, so you can explore the product immediately.
- The Prisma schema and seed pipeline are ready for a real PostgreSQL connection.
- The current auth route includes admin-only role protection and demo credentials for local validation.
- CMS API routes are live when PostgreSQL is configured; without a database the admin pages fall back to demo-mode data for safe UI previewing.
