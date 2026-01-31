# RAWR Streamware - Deployment Guide

This guide ensures your application is successfully deployed to Vercel and fully operational in a production environment.

## 1. Prerequisites

Ensure you have the following accounts and access:
- **Vercel Account**: For hosting the Next.js application.
- **Supabase Project**: Ensure your database is live and `orders` table has the `address` column.
- **Stripe Account**: Activated for live payments (or test mode for staging).
- **Resend Account**: For sending transactional emails.

## 2. Environment Variables

Configure these variables in your Vercel Project Settings > Environment Variables.

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_URL` | The URL of your deployed app | `https://rawr.stream` (or your Vercel URL) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Public Key | `eyJ...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Public Key | `pk_live_...` (or `pk_test_...`) |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | `sk_live_...` (or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret | `whsec_...` (See Section 4) |
| `RESEND_API_KEY` | Resend API Key for Emails | `re_...` |

## 3. Database Check (Supabase)

Ensure you have run the latest migration to store shipping addresses:

```sql
-- Run in Supabase SQL Editor
alter table public.orders 
add column if not exists address jsonb;
```

Verify your Row Level Security (RLS) policies allow:
- **Authenticated Users** to create orders/items.
- **Admins** (or service role) to update order status.

## 4. Stripe Webhook Configuration

1. Go to your [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **Add Endpoint**.
3. **Endpoint URL**: `https://<YOUR_VERCEL_DOMAIN>/api/webhooks/stripe`
   - *Example*: `https://rawr-streamware.vercel.app/api/webhooks/stripe`
4. **Events to listen for**:
   - `payment_intent.succeeded`
5. Click **Add Endpoint**.
6. Reveal the **Signing Secret** (`whsec_...`) and add it to your Vercel Environment Variables as `STRIPE_WEBHOOK_SECRET`.

## 5. Deployment Steps

1. **Push to GitHub**: Ensure your latest code is pushed to the `main` branch.
2. **Import to Vercel**:
   - Go to Vercel Dashboard > Add New > Project.
   - Select your GitHub Repository (`rawr`).
   - Framework Preset: **Next.js**.
   - Root Directory: `apps/web` (Since this is a monorepo structure).
3. **Configure Build Settings**:
   - Build Command: `next build` (or default).
   - Install Command: `npm install` (or default).
4. **Add Environment Variables**: Copy valid keys from your `.env` (excluding defaults).
5. **Deploy**: Click **Deploy**.

## 6. Post-Deployment Verification

1. **Visit your site**.
2. **Test Checkout**:
   - Use a Stripe Test Card (if using test keys) or a real card (refunding immediately).
   - Ensure the "Processing" state works.
   - Verify you are redirected to the Success Page.
   - Check your Email for the Resend receipt.
3. **Check Admin Panel**:
   - Go to `/admin/orders` (Ensure you are logged in).
   - Verify the new order appears with "Paid" status.
   - Click the order to view the **Shipping Address**.

## 7. Troubleshooting

- **Webhook Failures**: Check Stripe Dashboard > Webhook logs. 
  - *Fix*: Ensure `STRIPE_WEBHOOK_SECRET` matches exactly.
- **Email Not Sent**: Check Resend Logs.
  - *Fix*: Ensure domain verification is complete in Resend if sending to non-test emails.
- **Build Errors**: Check Vercel Build Logs.
