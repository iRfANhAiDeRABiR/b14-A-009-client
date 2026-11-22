# GearNest — Equipment Rental Platform

GearNest is a multi-role equipment rental marketplace built with Next.js (App Router) and React 19, connecting customers with verified equipment owners across construction, photography, transportation, agriculture, electronics, and event production.

## Project Overview

GearNest organizes marketplace operations around three role-protected portals while maintaining public catalog discovery:

- **Customers:** Browse approved equipment listings, filter and sort by category, price, rental type, and availability, calculate rental estimates, save favorites, submit reservations, pay via Stripe Hosted Checkout, and inspect rental & transaction history.
- **Equipment Owners:** View fleet analytics, publish new equipment listings with validated specs and secure backend image uploads, edit or delete owned listings, and monitor bookings placed against their fleet.
- **Administrators:** Monitor platform-wide user, inventory, booking, and settled revenue analytics, manage user roles (`Customer`, `Owner`, `Admin`), review and moderate equipment submissions (`Approve`, `Reject`, `Update`, `Delete`), and audit marketplace rentals.

## Live Website

- **Production Live URL:** Pending deployment (not yet deployed to a public host).
- **Local Development URL:** [http://localhost:3000](http://localhost:3000)

## Client Repository

- **GitHub Repository:** `https://github.com/iRfANhAiDeRABiR/b14-A-009-client-`

## Key Features

- **Public Equipment Marketplace:** Multi-page storefront (`/`, `/equipment`, `/equipment/[id]`, `/how-it-works`, `/about`, `/contact`, `/help-center`, `/terms`, `/privacy`) with dynamic search, filters, sorting, and server-compatible pagination.
- **Authentication & Role-Based Authorization:** Email/password registration and sign-in, Google OAuth entry, Better Auth HTTP-only session client with memory-cached JWT retrieval (`better-auth/client/plugins`), persistent session reloads, and fail-closed `ProtectedRoute` portals for Customers, Owners, and Admins.
- **Customer Workspace:** Overview analytics, advanced booking history with search/status/payment filters, synchronized MongoDB-backed favorites management, profile updates, rental pricing estimator, and Stripe Hosted Checkout confirmation/cancellation pages.
- **Owner Workspace:** Business analytics cards and interactive monthly earnings/rental charts, equipment listing creation and editing with upload progress, inventory status tracking (`Pending`, `Approved`, `Rejected`), and owner-scoped rental bookings monitor.
- **Admin Workspace:** Seven-metric platform overview, monthly booking and revenue charts, equipment approval distribution chart, platform activity feed, user role management, equipment approval/rejection/edit/delete moderation, and cross-platform rental auditing.
- **Global Experience & Polish:** Branded App Router loading states, route/global error boundaries, 404 recovery page, responsive mobile/tablet/desktop layouts, WCAG-conscious focus states, `prefers-reduced-motion` support, and persistent Dark/Light mode toggle.

## Technology Stack

- **Framework:** Next.js `16.4.6` (App Router, `cacheComponents: true`, `partialPrefetching: true`)
- **UI Runtime:** React `19.3.0` (`JavaScript`, zero TypeScript files)
- **Styling:** Tailwind CSS `4.3.3` with CSS variable design tokens for Light & Dark themes
- **Authentication Client:** Better Auth `^1.7.27` (`better-auth/react` + `jwtClient`)
- **Animations:** Framer Motion `^14.14.0`
- **Icons:** Lucide React `^1.77.0`
- **Class Utilities:** `clsx` `^2.1.1`, `tailwind-merge` `^3.7.1`
- **Charts & Visualizations:** Custom accessible GearNest SVG/CSS bar, trend line, and donut charts (note: `recharts` is not installed in `package.json`)

## Installed npm Packages

From [`package.json`](package.json):

### Dependencies

- `better-auth`: `^1.7.27`
- `clsx`: `^2.1.1`
- `framer-motion`: `^14.14.0`
- `lucide-react`: `^1.77.0`
- `next`: `16.4.6`
- `react`: `19.3.0`
- `react-dom`: `19.3.0`
- `tailwind-merge`: `^3.7.1`

### DevDependencies

- `@tailwindcss/turbopack`: `4.3.3`
- `eslint`: `^9`
- `eslint-config-next`: `16.4.6`
- `tailwindcss`: `4.3.3`

## Installation

Install dependencies inside the `client` directory:

```bash
cd client
npm install
```

## Environment Setup

Copy `.env.example` to `.env.local` and supply environment values without committing `.env.local` to Git:

```bash
cp .env.example .env.local
```

Client variables documented in [`.env.example`](.env.example):

- `NEXT_PUBLIC_API_BASE_URL` — Base URL of the Express backend server (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_SITE_URL` — Public URL of the Next.js client (e.g. `http://localhost:3000`) for metadata and Open Graph resolution
- `NEXT_PUBLIC_IMGBB_API_KEY` — Optional key for direct registration avatar uploads (owner equipment photos proxy through the Express API)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Optional placeholder for client-side Stripe test key (`STRIPE_SECRET_KEY`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, and database URIs must remain strictly on the Express backend)

## Development

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

Run ESLint and verify an optimized production build locally:

```bash
npm run lint
npm run build
npm run start
```

## Deployment

The client app is configured for standard Next.js deployment (including Vercel):

1. Set Root Directory to `client` when connecting the repository to Vercel or your Node host.
2. Configure production environment variables (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`, and optional public keys) in the hosting dashboard.
3. Configure the Express backend CORS policy to accept requests (with `credentials: true`) from the deployed Next.js origin.
4. Register the deployed frontend callback/return URLs in Better Auth, Google OAuth, and Stripe Checkout (`${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}` and `${CLIENT_URL}/payment/cancel`).

## Application Routes

### Public & Marketplace Routes

- `/` — Marketplace landing page
- `/equipment` — All approved equipment catalog with search, filters, sorting, and pagination
- `/equipment/[id]` — Equipment details, rental price calculator, favorites, and booking modal
- `/how-it-works`, `/about`, `/contact`, `/help-center`, `/terms`, `/privacy` — Informational pages
- `/login`, `/register` — Authentication pages

### Stripe Checkout Return Routes (Protected)

- `/payment/success` — Server-verified checkout session polling & confirmation view
- `/payment/cancel` — Checkout cancellation handler & eligible retry flow

### Role-Protected Dashboard Routes (`noindex`)

- `/dashboard` — Session role router
- **Customer:** `/dashboard/customer`, `/dashboard/customer/my-rentals`, `/dashboard/customer/favorites`, `/dashboard/customer/profile`
- **Owner:** `/dashboard/owner`, `/dashboard/owner/add-equipment`, `/dashboard/owner/my-equipment`, `/dashboard/owner/my-equipment/edit/[id]`, `/dashboard/owner/rentals`, `/dashboard/owner/profile`
- **Admin:** `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/equipment`, `/dashboard/admin/rentals`, `/dashboard/admin/profile`

## Authentication & Security Architecture

- Better Auth manages HTTP-only session cookies and issues short-lived JWTs cached strictly in memory (`src/lib/token-provider.js`), never written to `localStorage` or `sessionStorage` (`localStorage` stores only UI `"gearnest-theme"` preference).
- All protected API calls attach `Authorization: Bearer <jwt>` and handle `401` and `403` fail-closed.
- Owners cannot modify approval statuses (`Pending`, `Approved`, `Rejected`), and Stripe Checkout URLs are validated strictly against HTTPS `checkout.stripe.com` hosts before navigation. Payment confirmation relies exclusively on backend session verification and Stripe webhook processing.

## API Configuration

All service modules (`authService`, `contactService`, `profileService`, `equipmentService`, `imageUploadService`, `favoriteService`, `bookingService`, `paymentService`, `customerService`, `ownerAnalyticsService`, `adminAnalyticsService`, `adminUserService`, `adminEquipmentService`, `adminRentalService`) read `NEXT_PUBLIC_API_BASE_URL` via centralized [`src/lib/apiClient.js`](src/lib/apiClient.js) and [`src/lib/auth-client.js`](src/lib/auth-client.js) without hardcoded component URLs or fake data overrides on API failure.

## Known Limitations

- **Express Backend Pending:** The companion `server/` application is not yet implemented, so live database persistence, Better Auth server routes (`/api/auth/*`), MongoDB aggregations, owner image upload proxying, `POST /api/contact` inquiry persistence, Stripe Checkout session creation (`POST /api/payments/create-checkout-session`), and Stripe webhook fulfillment (`checkout.session.completed`) remain awaiting backend development and end-to-end integration testing.
- **Public Catalog Fallback:** Public `/equipment` discovery gracefully supports curated demo preview records when the backend API is unreachable or unconfigured, clearly distinguished from live authenticated dashboard modules which require a running Express server.
