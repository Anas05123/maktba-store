# Maktba Store

Professional stationery e-commerce and operations platform for Tunisia, built as a customer-facing store plus a private ERP-lite admin system.

## Product scope

This project now covers the main workflows a real stationery business needs:

- public B2C storefront for normal customers
- customer account area with orders, profile, addresses, and invoices
- protected admin CMS for products, categories, customers, orders, deliveries, invoices, finance, and reports
- structured order lifecycle with fulfillment, packaging, and delivery statuses
- invoice documents and printable financial report exports
- PostgreSQL + Prisma schema designed for commerce and operations

## Stack

- Next.js 16 App Router
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui
- Prisma ORM
- PostgreSQL
- NextAuth credentials auth
- React Hook Form + Zod
- Zustand
- Recharts
- TanStack Table

## Core capabilities

### Public storefront

- homepage, catalog, categories, product detail pages
- cart and Tunisia-ready checkout
- customer sign in and registration entry point
- account dashboard, order history, order detail pages
- invoice document pages ready for print/PDF export

### Admin / operations

- admin-only dashboard shell
- product, category, customer, and order management
- deliveries page with tracking-oriented workflow view
- invoices registry page
- finance and reporting pages
- printable financial report export page

### Order operations

- unique order number generation
- customer, billing, and shipping details capture
- payment record creation
- invoice record creation
- delivery record creation
- fulfillment and packaging history creation

## Database model

The Prisma schema now includes business-oriented operational entities:

- `users`, `roles`, `customer_profiles`, `customers`, `addresses`
- `products`, `product_images`, `product_variants`, `categories`, `brands`
- `inventory`, `inventory_logs`, `stock_movements`
- `carts`, `cart_items`
- `orders`, `order_items`, `payments`
- `invoices`, `invoice_items`
- `deliveries`, `delivery_tracking_events`
- `fulfillment_status_history`, `packaging_status_history`
- `expenses`, `financial_reports`
- `audit_logs`, `notifications`
- NextAuth support tables: `accounts`, `sessions`, `verification_tokens`

The schema is structured for:

- customer accounts and retail checkout
- invoice and delivery linkage
- status history and auditability
- inventory visibility and low stock tracking
- PDF-ready document regeneration from stored data
- future expansion into more complete ERP processes

## Project structure

```text
src/
  app/
    (store)/
      account/
      cart/
      catalog/
      categories/
      checkout/
      products/
    admin/
      deliveries/
      invoices/
      reports/
    api/
      admin/
      auth/
      checkout/
  components/
    account/
    admin/
    documents/
    forms/
    layout/
    shared/
    store/
    tables/
    ui/
  data/
    demo-store.ts
  lib/
    admin/
    auth.ts
    checkout.ts
    demo-data.ts
    operations.ts
    prisma.ts
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
OWNER_FINANCE_PASSWORD="OwnerFinance123!"
DEEPSEEK_API_KEY=""
DEEPSEEK_MODEL="deepseek-chat"
DEEPSEEK_BASE_URL="https://api.deepseek.com"
```

Notes:

- Keep real secrets only in `.env`, never in `.env.example`.
- The on-site AI assistant automatically uses DeepSeek when `DEEPSEEK_API_KEY` is present.
- After changing `.env`, restart the dev server.

## Local setup

```bash
npm install
npx prisma generate
npm run db:push
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
- Seeded customer account: `client@maktba.tn` / `Client123!`

## Notes

- Customer registration becomes live when PostgreSQL is connected and seeded.
- Checkout uses `/api/checkout` and creates structured business records when the database is available.
- Invoice and financial report exports are implemented as professional print/PDF-ready document pages.
- After Prisma schema changes, run `npm run db:push` and redeploy so Supabase stays in sync.

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm run build`
