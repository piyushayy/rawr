# RAWR SYSTEMS // MONOREPO

> **SCARCITY IS THE PRODUCT.**

This repository contains the source code for the Rawr Store ecosystem.

## Architecture

- **Apps**:
  - `web`: Next.js 16 (App Router) + Tailwind v4 + Framer Motion. The client-facing storefront.

## Setup & Development

1. **Install Dependencies**:
   ```bash
   cd apps/web
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access**:
   Access the store at `http://localhost:3000`.

## Design System (Neo-Brutalism)

The design system is codified in `apps/web/src/app/globals.css`.
- **Colors**: Rawr Red (`#E60000`), Void Black (`#050505`), Paper White (`#F2F2F2`).
- **Typography**: Oswald (Headings), Inter (Body).
- **Motion**: Framer Motion for all interactions.
- **Cart**: Persisted via Zustand.

## Features implemented

- [x] Home Page (Hero, Marquee, Latest Drops)
- [x] Shop Page (Filtering, Grid)
- [x] Product Detail (Gallery, Sizes, Add to Cart)
- [x] Cart Drawer (Slide-out, Persistence)
- [x] Checkout (Stripe-ready UI)
- [x] Drops (Countdown Timer)
- [x] Manifesto (About)
- [x] Custom Toaster (Sonner)

## Roadmap

- [ ] **Phase 1**: Frontend Foundation (Completed)
- [ ] **Phase 2**: Supabase Integration (Auth, Database)
- [ ] **Phase 3**: Stripe Payments
- [ ] **Phase 4**: Admin Dashboard

## Credits

Architected by **Antigravity**.
