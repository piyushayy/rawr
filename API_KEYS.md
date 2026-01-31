# RAWR Streamware - API Key Guide

This project requires services for Database, Authentication, Payments, and Email. Below is a guide on how to obtain the necessary keys.

## 1. Supabase (Database & Auth)
**Website**: [https://supabase.com](https://supabase.com)

1.  Create a new project.
2.  Go to **Project Settings** > **API**.
3.  Copy the `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
4.  Copy the `anon` / `public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5.  *Important*: Go to **SQL Editor** and run the schemas provided in `apps/web/supabase/`.

## 2. Stripe (Payments)
**Website**: [https://stripe.com](https://stripe.com)

1.  Create an account.
2.  Go to **Developers** > **API keys**.
3.  Copy the `Publishable key` -> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4.  Copy the `Secret key` -> `STRIPE_SECRET_KEY`
5.  **Webhooks**:
    *   Go to **Developers** > **Webhooks**.
    *   Add an endpoint pointing to your deployed URL (e.g., `https://your-site.vercel.app/api/webhooks/stripe`).
    *   Select event: `payment_intent.succeeded`.
    *   Reveal the `Signing secret` -> `STRIPE_WEBHOOK_SECRET`.

## 3. Resend (Transactional Emails)
**Website**: [https://resend.com](https://resend.com)

1.  Create an account.
2.  Add and verify your domain (required for sending to non-test emails).
3.  Go to **API Keys** and create a new key.
4.  Copy the key -> `RESEND_API_KEY`.

---

## Where to save these keys?

### Local Development
Create a file named `.env.local` in `apps/web/`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RESEND_API_KEY=...
```

### Production (Vercel)
Go to **Settings** > **Environment Variables** in your Vercel project and add them there.
