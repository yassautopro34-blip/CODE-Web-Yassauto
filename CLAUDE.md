# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YASSAUTO is a French automotive services website (Montpellier area) offering vehicle purchase accompaniment and general mechanics. Built with Next.js 16 (canary), React 19, TypeScript, Tailwind CSS v4, and MongoDB via Mongoose.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (ESLint with next/core-web-vitals + typescript configs)
- **Email preview:** `pnpm dev-email` (react-email dev server for email templates)

## Architecture

### Route Groups

- `src/app/(main)/` — Public pages wrapped in shared `Layout` (header/footer). Pages: home, accompagnement, mecanique, propos, contact, confirmation.
- `src/app/admin/` — Admin dashboard (no shared layout, has its own login screen).

### API Routes (`src/app/api/`)

- `create-checkout-session/` — Creates a booking in MongoDB, sends admin email notification via Resend, then creates a Stripe checkout session (20EUR deposit).
- `webhook/` — Stripe webhook handler. On `checkout.session.completed`: updates booking status, sends success email.
- `stripe-session/` — Retrieves Stripe session details for the confirmation page.
- `quotes/` and `bookings/` — CRUD endpoints for mechanic quotes and bookings (used by admin dashboard).

### Key Layers

- **`src/lib/`** — Server-side logic: MongoDB connection (`db.ts`), Mongoose models (`models/`), server actions for bookings/quotes/emails/cookies.
- **`src/components/`** — Organized by page/feature: `assistance/` (multi-step booking wizard), `mechanics/` (quote form), `admin/` (dashboard components), `layout/` (header/footer/nav), `home/`, `contact/`, `about/`, `confirmation/`, `shared/`.
- **`src/hooks/`** — Client-side form state hooks (`useAssistance.ts`, `useMechanics.ts`).
- **`src/types/index.ts`** — Shared types: `BookingDetails`, `MechanicQuote`, `Step` enum, `TIME_SLOTS`, `SERVICE_ZONES`.
- **`emails/`** — React Email templates (`admin-email.tsx`, `success-email.tsx`).

### External Services

- **Stripe** — Payment processing (checkout sessions + webhooks).
- **MongoDB** — Data persistence (bookings, mechanic quotes).
- **Resend** — Transactional emails.
- **Google Analytics** — Via `@next/third-parties`, with GDPR consent mode and cookie banner.
- **Vercel Analytics** — `@vercel/analytics`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

### Booking Flow

1. User fills multi-step form (date -> details -> payment) via `useAssistance` hook.
2. Form submits to `POST /api/create-checkout-session` which saves booking + redirects to Stripe.
3. Stripe webhook confirms payment, updates booking status, sends confirmation email.
4. User lands on `/confirmation?session_id=...` which fetches session details.

## Language

The UI is entirely in French. Use French for user-facing strings.