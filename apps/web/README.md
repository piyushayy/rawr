# RAWR Streamware - Premium E-Commerce Store

A luxury, high-performance e-commerce platform built for exclusivity and aesthetics.

## Key Features (v2 Upgrade)

### 🛒 Advanced Shopping
- **Product Variants**: Full support for Sizes (XS-XXL) with individual stock tracking.
- **Dynamic Cart**: Persists across sessions, handles quantities and variant selection.
- **Multi-Gateway Checkout**: Seamless integration of **Razorpay (India)** and **Stripe (International)** based on user location/preference.

### 👑 CRM & Admin Dashboard (`/admin`)
- **Customer Profiles**: Track Lifetime Value (LTV), Order History, and Clout Score.
- **Internal Notes**: Add private admin notes for VIP customers.
- **Support Tickets**: Manage customer inquiries directly from their profile.
- **Order Fulfillment**: Mark orders as Shipped with Tracking Numbers.

### 🤖 Marketing Automation
- **Transactional Emails**: Automated Order Confirmation and Shipping Updates (via Resend).
- **Abandoned Cart Recovery**: Automated hourly cron job to recover lost sales.

---

## Deployment & Setup

### 1. Environment Variables
Add these to your Vercel Project Settings:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payments (Razorpay - India)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Payments (Stripe - Global)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email Automation
RESEND_API_KEY=re_...

# Security & Cron
CRON_SECRET=generate_random_secure_string
```

### 2. Database Migrations
Run the SQL files in `supabase/migrations/` in order using the Supabase SQL Editor:
1. `20260207_core_upgrade.sql` (Tables & Schemas)
2. `20260207_data_migration.sql` (Migrate existing products)
3. `20260207_rpc_functions.sql` (Stock Logic)
4. `20260208_admin_policies.sql` (RLS Security & Marketing)

### 3. Vercel Cron Job
The project includes a `vercel.json` to schedule the Abandoned Cart Recovery job every hour.
- Ensure `CRON_SECRET` is set in Vercel Environment Variables.
- Vercel handles the rest automatically.

---

## Admin Access
To grant Admin access to a user:
1. Go to Supabase Table Editor -> `profiles`.
2. Find the user row.
3. Change the `role` column from `customer` to `admin`.
4. The user can now access `/admin`.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + Framer Motion
- **Payments**: Razorpay + Stripe
- **Email**: Resend
