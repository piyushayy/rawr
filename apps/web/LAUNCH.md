# RAWR Launch Checklist

## Pre-Flight Checks
- [ ] **Environment Variables**: Ensure all secrets (Supabase, Stripe, Email) are set in Vercel/Production environment.
- [ ] **Database**: Run all SQL migrations in `supabase/` folder.
    - `schema.sql`, `profiles.sql`, `addresses.sql`, `wishlist.sql`, `reviews.sql`, `inbox.sql`, `pulse.sql`, `gallery.sql`, `drops.sql`, `referrals.sql`, `articles.sql`, `lookbook.sql`.
- [ ] **Storage Buckets**: Ensure `reviews` bucket exists and is public.
- [ ] **Admin User**: Set up at least one admin user (email `piyus...` or set in DB).

## Feature Verification
- [ ] **Auth**: Login (Email/Google) and Signup work.
- [ ] **Shop**: Products load, search works, sorting works.
- [ ] **Cart**: Add/Remove items, update quantity.
- [ ] **Checkout**: Order creation, address selection, "payment" demo.
- [ ] **Profile**: addresses, wishlists, orders, gallery uploads.
- [ ] **Referrals**: Referral code generation and attribution.
- [ ] **Drops**: Countdown timer and restricted access for future release dates.
- [ ] **Content**: Blog (Manifesto) and Lookbook loading.

## Post-Launch
- [ ] Monitor **Vercel Logs** for errors.
- [ ] Check **Supabase Dashboard** for database load.
- [ ] Watch **The Pulse** (Global Feed) for user activity.
