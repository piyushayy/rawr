# RAWR Launch Checklist

## Pre-Flight Checks
- [ ] **Environment Variables**: Ensure all secrets (Supabase, Stripe, Email) are set in Vercel/Production environment.
- [ ] **Database**: Run all SQL migrations in `supabase/` folder.
    - `schema.sql`, `profiles.sql`, `addresses.sql`, `wishlist.sql`, `reviews.sql`, `inbox.sql`, `pulse.sql`, `gallery.sql`, `drops.sql`, `referrals.sql`, `articles.sql`, `lookbook.sql`.
- [ ] **Storage Buckets**: Ensure `reviews` bucket exists and is public.
- [ ] **Admin User**: Set up at least one admin user (email `piyus...` or set in DB).

## Feature Verification
- [x] **Auth**: Login (Email/Google) and Signup work.
- [x] **Shop**: Products load, search works, sorting works.
- [x] **Cart**: Add/Remove items, update quantity.
- [x] **Checkout**: Order creation, address selection, "payment" demo.
- [x] **Profile**: addresses, wishlists, orders, gallery uploads.
- [x] **Referrals**: Referral code generation and attribution.
- [x] **Drops**: Countdown timer and restricted access for future release dates.
- [x] **Content**: Blog (Manifesto) and Lookbook loading.

## Post-Launch
- [x] Monitor **Vercel Logs** for errors.
- [x] Check **Supabase Dashboard** for database load.
- [x] Watch **The Pulse** (Global Feed) for user activity.
