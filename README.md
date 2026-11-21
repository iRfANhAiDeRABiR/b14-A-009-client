# GearNest — Equipment Rental Platform (Client)

GearNest is a modern equipment rental marketplace built with Next.js (App Router) that connects verified equipment owners with customers seeking flexible daily, weekly, and monthly rentals across construction, photography, transportation, agriculture, electronics, and events.

## Project Purpose

- **For Renters (Customers):** Discover verified equipment, inspect availability and pricing, save favorites, book rental durations, and pay securely via Stripe Checkout.
- **For Equipment Owners:** List equipment with specifications and pricing, manage inventory approval status, and monitor rental requests and earnings.
- **For Administrators:** Moderate equipment listings, manage user roles, and monitor platform-wide bookings and revenue analytics.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (React 19)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Utilities:** `clsx`, `tailwind-merge`

## Project Structure

```text
src/
  app/
    layout.js        # Root layout, metadata, Google Fonts (Manrope & Inter)
    page.js          # Initial GearNest landing page
    globals.css      # Tailwind v4 setup and GearNest design tokens
  components/
    equipment/       # Reusable EquipmentCard and EquipmentCardSkeleton
    home/            # Homepage sections (Hero, Featured, Categories, WhyChooseUs, HowItWorks, Reviews, RecentlyAdded, OwnerCTA)
    layout/          # Navbar, Footer, and MainLayout
    shared/          # BrandLogo and reusable placeholder pages
    ui/              # Design system components (Button, Input, Badge, Card, SectionHeading, Container, Skeleton)
  data/              # Demo fallback equipment, categories, and sample reviews
  lib/               # Utilities and site configuration constants
  hooks/             # Custom React hooks (future milestones)
  services/          # API client services (equipmentService)
  context/           # React context providers (future milestones)
public/
  images/            # Curated local imagery
  icons/             # Brand mark and vector assets
```

## Environment Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in the environment variables in `.env.local`. Never commit `.env.local` or secret credentials to version control.

## Installation & Commands

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Run ESLint:

```bash
npm run lint
```

Build for production and start the production server:

```bash
npm run build
npm run start
```
