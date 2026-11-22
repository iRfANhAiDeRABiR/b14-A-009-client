# GearNest — Equipment Rental Platform (Client)

GearNest is a modern equipment rental marketplace built with Next.js (App Router) that connects verified equipment owners with customers seeking flexible daily, weekly, and monthly rentals across construction, photography, transportation, agriculture, electronics, and events.

## Project Purpose

- **For Renters (Customers):** Discover verified equipment, inspect availability and pricing, save favorites, book rental durations, and pay securely via Stripe Checkout.
- **For Equipment Owners:** List equipment with specifications and pricing, manage inventory approval status, and monitor rental requests and earnings.
- **For Administrators:** Moderate equipment listings, manage user roles, and monitor platform-wide bookings and revenue analytics.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (React 19)
- **Authentication:** Better Auth (`better-auth/react`, HTTP-only session cookies, JWT plugin, Google OAuth)
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
    login/           # Login page wrapped in Suspense
    register/        # Registration page wrapped in Suspense
    dashboard/       # Role-protected Customer, Owner, and Admin workspaces (/dashboard/{customer,owner,admin}/*)
  components/
    auth/            # AuthLayout, LoginForm, RegisterForm, GoogleLoginButton, PasswordInput, ProtectedRoute, 403/Session states
    customer/        # CustomerOverview, CustomerStats, MonthlyRentalChart, RecentRentals, FavoritePreview, MyRentalsTable, BookingDetailsModal, BookingHistoryFilters, BookingPaymentSummary, FavoritesTable, FavoriteFilters, FavoriteEquipmentCard, RemoveFavoriteDialog, FavoriteEmptyState, ProfileForm
    owner/           # OwnerAnalyticsOverview, OwnerDashboardHeader, OwnerStatsCards, OwnerEarningsChart, OwnerRentalChart, OwnerEquipmentPerformance, OwnerRecentRentals, OwnerQuickActions, AddEquipmentForm, EquipmentBasicInfo, EquipmentRentalInfo, EquipmentSpecifications, EquipmentImageUpload, EquipmentLivePreview, OwnerInformationCard, RentalTermsForm
    dashboard/       # DashboardLayout, DashboardSidebar, DashboardHeader, DashboardMobileNav, DashboardBreadcrumbs, DashboardUserMenu, Skeletons
    equipment/       # Catalog, EquipmentDetails, Gallery, Specifications, OwnerCard, FavoriteButton, BookingModal, Summary & Calculator
    home/            # Homepage sections (Hero, Featured, Categories, WhyChooseUs, HowItWorks, Reviews, RecentlyAdded, OwnerCTA)
    layout/          # Navbar, Footer, ChromeSlots, and MainLayout (with ToastProvider, AuthProvider & FavoriteProvider)
    shared/          # BrandLogo and reusable placeholder pages
    ui/              # Design system components (Button, Input, Badge, Card, ConfirmDialog, SectionHeading, Container, Skeleton, ToastViewport)
  context/           # React context providers (AuthProvider, FavoriteProvider, ToastContext)
  data/              # Demo fallback equipment, categories, and sample reviews
  lib/               # Utilities, site config, Better Auth client, JWT token-provider, apiClient, validation, customerUtils, ownerUtils, roleNavigation & pricing
  hooks/             # Custom React hooks (useAuth, useEquipment, useEquipmentDetails, useFavorites, useMyBookings, useOwnerAnalytics, useEquipmentForm)
  services/          # API client services (authService, customerService, ownerAnalyticsService, equipmentService, imageUploadService, favoriteService, bookingService, profileService)
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
