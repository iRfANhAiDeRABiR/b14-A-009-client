::: {align="center"}
# 🟢 GearNest

### Find the right equipment. Rent with confidence.

**A modern equipment rental marketplace connecting customers with
equipment owners.**

```{=html}
<p>
```
`<a href="https://github.com/iRfANhAiDeRABiR/b14-A-009-client">`{=html}
`<img src="https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub repository">`{=html}
`</a>`{=html}
`<img src="https://img.shields.io/badge/Next.js-16.4.6-000000?style=for-the-badge&logo=next.js" alt="Next.js">`{=html}
`<img src="https://img.shields.io/badge/React-19.3.0-149ECA?style=for-the-badge&logo=react" alt="React">`{=html}
`<img src="https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">`{=html}
`<img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=222222" alt="JavaScript">`{=html}
```{=html}
</p>
```
[Explore the
repository](https://github.com/iRfANhAiDeRABiR/b14-A-009-client) ·
[Report an
issue](https://github.com/iRfANhAiDeRABiR/b14-A-009-client/issues)
:::

------------------------------------------------------------------------

## ✨ About GearNest

GearNest is a responsive, multi-role equipment rental marketplace built
with **Next.js App Router and React**. It brings equipment discovery,
rental planning, booking interfaces, payment experiences, and
role-specific management tools into one platform.

Whether someone needs construction machinery for a project, photography
equipment for a shoot, or event equipment for a special occasion,
GearNest is designed to make the rental journey easier to navigate.

The client application is organized around three user experiences:

  -----------------------------------------------------------------------
  🧑 Customer             🧰 Equipment Owner      🛡️ Administrator
  ----------------------- ----------------------- -----------------------
  Discover equipment,     Submit and manage       Manage users, moderate
  compare listings, save  equipment listings,     equipment listings,
  favorites, plan         monitor rental          monitor rentals, and
  rentals, and review     activity, and review    review platform
  booking history.        business analytics.     analytics.

  -----------------------------------------------------------------------

## 🚀 What You Can Do

### 🛍️ Discover the Marketplace

-   Explore equipment through a responsive public catalog.
-   View equipment details, images, rental prices, locations, and
    listing information.
-   Search and refine the catalog using category, rental type, price,
    and availability controls.
-   Sort listings and navigate paginated results.
-   Explore featured equipment and marketplace categories.

### 👤 Customer Experience

-   Access a dedicated Customer dashboard.
-   Review rental history and booking details.
-   Search and filter rental records by relevant status.
-   Save and manage favorite equipment.
-   Update profile information.
-   Estimate rental costs using the rental calculator.
-   Continue to Stripe Hosted Checkout through the booking flow.
-   View payment success, processing, and cancellation states.

### 🧰 Equipment Owner Experience

-   View an Owner dashboard with business overview cards and charts.
-   Submit new equipment listings.
-   Upload equipment images through the configured upload flow.
-   Edit and manage owned equipment.
-   Track listing review states: `Pending`, `Approved`, and `Rejected`.
-   Review rental bookings associated with owned equipment.
-   Monitor earnings and rental activity visualizations.

### 🛡️ Admin Experience

-   View platform-level dashboard analytics.
-   Review user, equipment, booking, and revenue summaries.
-   Manage user roles: `Customer`, `Owner`, and `Admin`.
-   Review equipment submissions.
-   Approve or reject equipment listings.
-   Update or remove equipment listings.
-   Monitor platform-wide rental records.

### 🎨 Interface & Experience

-   Responsive layouts for mobile, tablet, and desktop.
-   Consistent GearNest visual design system.
-   Light and dark theme support.
-   Reusable loading and skeleton states.
-   Route-level and global error handling.
-   Custom not-found experience.
-   Accessible form labels, focus states, and keyboard interactions.
-   Reduced-motion support where applicable.

> **Integration note:** The frontend contains the user interfaces and
> service-layer integrations for these workflows. Features that read or
> change persistent data require the matching Express API, MongoDB
> configuration, OAuth credentials, and Stripe configuration. See
> [Integration Status](#-integration-status).

------------------------------------------------------------------------

## 🧭 Application Preview

The main application areas are organized as follows:

  -----------------------------------------------------------------------
  Area                    Route                   Purpose
  ----------------------- ----------------------- -----------------------
  Home                    `/`                     Marketplace landing
                                                  page and featured
                                                  equipment

  Equipment               `/equipment`            Browse, search, filter,
                                                  and sort equipment

  Equipment details       `/equipment/[id]`       Review a listing and
                                                  start a rental

  How It Works            `/how-it-works`         Customer and Owner
                                                  workflow guide

  About                   `/about`                Platform story,
                                                  mission, and values

  Contact                 `/contact`              Contact and inquiry
                                                  form

  Login                   `/login`                Sign in

  Register                `/register`             Create an account
  -----------------------------------------------------------------------

### Customer Dashboard

  Route                              Purpose
  ---------------------------------- --------------------
  `/dashboard/customer`              Customer overview
  `/dashboard/customer/my-rentals`   Rental history
  `/dashboard/customer/favorites`    Saved equipment
  `/dashboard/customer/profile`      Profile management

### Owner Dashboard

  Route                                       Purpose
  ------------------------------------------- ---------------------------
  `/dashboard/owner`                          Owner analytics overview
  `/dashboard/owner/add-equipment`            Submit equipment
  `/dashboard/owner/my-equipment`             Manage owned listings
  `/dashboard/owner/my-equipment/edit/[id]`   Edit a listing
  `/dashboard/owner/rentals`                  Monitor equipment rentals
  `/dashboard/owner/profile`                  Profile management

### Admin Dashboard

  Route                          Purpose
  ------------------------------ ----------------------------
  `/dashboard/admin`             Platform analytics
  `/dashboard/admin/users`       User and role management
  `/dashboard/admin/equipment`   Equipment moderation
  `/dashboard/admin/rentals`     Platform rental monitoring
  `/dashboard/admin/profile`     Profile management

### Payment Return Routes

  -----------------------------------------------------------------------
  Route                               Purpose
  ----------------------------------- -----------------------------------
  `/payment/success`                  Check and display the
                                      backend-verified payment result

  `/payment/cancel`                   Handle a cancelled Checkout session
                                      and eligible retry flow
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🧱 Technology Stack

  Technology                  Role
  --------------------------- -----------------------------------------
  **Next.js 16.4.6**          React framework and App Router
  **React 19.3.0**            Component-based UI
  **JavaScript**              Application language
  **Tailwind CSS 4.3.3**      Utility-first styling and design tokens
  **Better Auth 1.7.27**      Authentication client integration
  **Framer Motion 14.14.0**   UI animation and transitions
  **Lucide React 1.77.0**     Interface icons
  **clsx 2.1.1**              Conditional class names
  **tailwind-merge 3.7.1**    Tailwind class conflict handling
  **Custom SVG/CSS charts**   Dashboard data visualization

### Package Inventory

The package versions below are based on the project information supplied
for this README. Check the repository's current `package.json` before
changing dependencies.

```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Production dependencies`</strong>`{=html}
```{=html}
</summary>
```
  Package                 Version
  ------------------ ------------
  `better-auth`         `^1.7.27`
  `clsx`                 `^2.1.1`
  `framer-motion`      `^14.14.0`
  `lucide-react`        `^1.77.0`
  `next`                 `16.4.6`
  `react`                `19.3.0`
  `react-dom`            `19.3.0`
  `tailwind-merge`       `^3.7.1`

```{=html}
</details>
```
```{=html}
<details>
```
```{=html}
<summary>
```
`<strong>`{=html}Development dependencies`</strong>`{=html}
```{=html}
</summary>
```
  Package                       Version
  -------------------------- ----------
  `@tailwindcss/turbopack`      `4.3.3`
  `eslint`                         `^9`
  `eslint-config-next`         `16.4.6`
  `tailwindcss`                 `4.3.3`

```{=html}
</details>
```

------------------------------------------------------------------------

## ⚙️ Getting Started

### Prerequisites

-   Node.js compatible with the installed Next.js version.
-   npm.
-   Git.
-   The GearNest Express API for backend-dependent functionality.

### 1. Clone the repository

``` bash
git clone https://github.com/iRfANhAiDeRABiR/b14-A-009-client.git
cd b14-A-009-client
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the example:

``` bash
cp .env.example .env.local
```

On Windows PowerShell:

``` powershell
Copy-Item .env.example .env.local
```

Add the correct values to `.env.local`. Never commit this file.

### 4. Start the development server

``` bash
npm run dev
```

Open **http://localhost:3000** in your browser.

------------------------------------------------------------------------

## 🔐 Environment Configuration

The frontend uses public environment variables for browser-accessible
configuration.

Example `.env.local`:

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: only when direct browser-based avatar upload is enabled.
NEXT_PUBLIC_IMGBB_API_KEY=

# Optional: only when the frontend directly uses Stripe.js.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

  --------------------------------------------------------------------------
  Variable                               Description
  -------------------------------------- -----------------------------------
  `NEXT_PUBLIC_API_BASE_URL`             Express API base URL

  `NEXT_PUBLIC_SITE_URL`                 Frontend URL used for metadata and
                                         return URL construction

  `NEXT_PUBLIC_IMGBB_API_KEY`            Optional browser-side ImgBB key if
                                         direct avatar upload is enabled

  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`   Optional Stripe publishable key for
                                         browser-side Stripe.js use
  --------------------------------------------------------------------------

### Security Rules

-   Anything prefixed with `NEXT_PUBLIC_` can be exposed in the browser
    bundle.
-   Never put `MONGODB_URI`, `BETTER_AUTH_SECRET`,
    `GOOGLE_CLIENT_SECRET`, `STRIPE_SECRET_KEY`, or
    `STRIPE_WEBHOOK_SECRET` in the client environment.
-   Keep private credentials in the Express backend environment.
-   Use a backend upload proxy for image services whenever possible.
-   Do not commit `.env.local`.

------------------------------------------------------------------------

## 🧪 Available Scripts

Run these commands from the project root:

  Command           Description
  ----------------- --------------------------------------
  `npm run dev`     Start the development server
  `npm run lint`    Run ESLint
  `npm run build`   Create an optimized production build
  `npm run start`   Start the production server

Before deployment, run:

``` bash
npm run lint
npm run build
```

After a successful build:

``` bash
npm run start
```

------------------------------------------------------------------------

## 🔒 Authentication & Authorization

The client is designed to integrate with a Better Auth server.

### Authentication methods

-   Email and password.
-   Google OAuth.
-   Session-aware navigation.
-   JWT retrieval for protected API requests.

### Role-based experience

  Role         Dashboard
  ------------ -----------------------
  `Customer`   `/dashboard/customer`
  `Owner`      `/dashboard/owner`
  `Admin`      `/dashboard/admin`

### Security approach

-   Better Auth manages the browser session using HTTP-only cookies.
-   The client retrieves access JWTs through the configured token
    provider.
-   Access tokens are cached in memory rather than persisted in
    `localStorage` or `sessionStorage`.
-   Protected API requests use the `Authorization: Bearer` header.
-   Unauthorized and forbidden responses are handled by the client.
-   Frontend route protection improves navigation experience, while the
    backend must independently enforce authorization.
-   A payment success redirect is not treated as proof of payment; the
    client must retrieve the verified status from the backend.

The `gearnest-theme` local-storage value is used for theme preference
only. It is not an authentication credential.

------------------------------------------------------------------------

## 💳 Booking & Payment Experience

The client booking journey is designed around this flow:

1.  Customer opens an approved equipment listing.
2.  Customer selects rental dates and quantity.
3.  The interface displays an estimated rental amount.
4.  The booking request is submitted to the backend.
5.  The backend validates availability and calculates the authoritative
    amount.
6.  The backend creates a Stripe Checkout Session.
7.  The customer is redirected to Stripe Hosted Checkout.
8.  Stripe sends payment events to the backend.
9.  The backend verifies payment and updates booking records.
10. The client retrieves the verified payment status.

**Important:** Rental price and inventory availability must always be
validated by the backend. The browser must not mark a booking as paid or
confirmed by itself.

------------------------------------------------------------------------

## 🗂️ Frontend Structure

The supplied project information identifies the following important
modules. Use the current repository tree as the source of truth if files
have moved.

``` text
src/
├── app/
│   ├── equipment/
│   ├── how-it-works/
│   ├── about/
│   ├── contact/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   │   ├── customer/
│   │   ├── owner/
│   │   └── admin/
│   └── payment/
├── components/
├── lib/
│   ├── apiClient.js
│   ├── auth-client.js
│   └── token-provider.js
└── services/
    ├── authService
    ├── contactService
    ├── profileService
    ├── equipmentService
    ├── imageUploadService
    ├── favoriteService
    ├── bookingService
    ├── paymentService
    ├── customerService
    ├── ownerAnalyticsService
    ├── adminAnalyticsService
    ├── adminUserService
    ├── adminEquipmentService
    └── adminRentalService
```

------------------------------------------------------------------------

## 🔌 Integration Status

The frontend contains the screens, interactions, and service-layer
integration points for the workflows described above. Persistent
functionality depends on a compatible Express backend and correctly
configured external services.

  -----------------------------------------------------------------------
  Integration                         Required configuration / service
  ----------------------------------- -----------------------------------
  Authentication                      Better Auth server, MongoDB
                                      adapter, trusted origins

  Google login                        Google OAuth Client ID and Client
                                      Secret on the backend

  User and role management            Protected Express user APIs

  Equipment catalog                   Equipment APIs and MongoDB

  Image uploads                       ImgBB configuration and/or backend
                                      upload proxy

  Favorites                           Customer-scoped Favorites APIs

  Rental booking                      Availability, pricing, and booking
                                      APIs

  Stripe Checkout                     Server-created Checkout Sessions

  Payment confirmation                Verified Stripe webhooks and
                                      payment records

  Contact form                        Contact API and database
                                      persistence

  Dashboard analytics                 Admin and Owner MongoDB aggregation
                                      APIs
  -----------------------------------------------------------------------

Update this section as integrations are completed and tested. Do not
describe a UI-only feature as a live backend operation.

------------------------------------------------------------------------

## 🌍 Deployment

The project is structured for standard Next.js deployment, including
Vercel.

### Vercel setup

1.  Import the client repository into Vercel.
2.  Set the project root to the directory containing the frontend
    `package.json`.
3.  Configure the production environment variables.
4.  Set `NEXT_PUBLIC_API_BASE_URL` to the deployed Express API URL.
5.  Set `NEXT_PUBLIC_SITE_URL` to the deployed frontend URL.
6.  Configure the backend CORS allowlist for the exact frontend origin.
7.  Configure Better Auth trusted origins and production base URL.
8.  Add the production Google OAuth callback URI in Google Cloud.
9.  Configure Stripe success and cancellation return URLs.
10. Deploy and verify direct route navigation and browser refresh.

### Production checklist

-   [ ] Homepage loads without runtime errors.
-   [ ] Equipment pages load directly and after refresh.
-   [ ] Login and logout work.
-   [ ] Session persists after refreshing a protected route.
-   [ ] Customer, Owner, and Admin permissions are enforced.
-   [ ] Frontend can reach the production API.
-   [ ] CORS and credentialed requests work.
-   [ ] Checkout redirects to a valid Stripe-hosted URL.
-   [ ] Payment success is based on backend verification.
-   [ ] No private credentials are exposed in the client bundle.

**Live URL:** Add the verified production URL after deployment.

------------------------------------------------------------------------

## 🖼️ Screenshots

A visual README is strongest when it includes real screenshots from the
finished application.

Suggested files:

``` text
docs/
└── screenshots/
    ├── homepage.png
    ├── equipment-catalog.png
    ├── equipment-details.png
    ├── login.png
    ├── customer-dashboard.png
    ├── owner-dashboard.png
    └── admin-dashboard.png
```

After adding the screenshot files, display them with:

``` md
![GearNest homepage](docs/screenshots/homepage.png)
```

Only reference screenshots that have actually been added to the
repository.

------------------------------------------------------------------------

## 🛠️ Troubleshooting

  -----------------------------------------------------------------------
  Problem                             What to check
  ----------------------------------- -----------------------------------
  API request fails                   Confirm `NEXT_PUBLIC_API_BASE_URL`
                                      and that the Express server is
                                      running.

  CORS error                          Check the backend allowlist and
                                      credential settings.

  Google login fails                  Verify the backend OAuth
                                      credentials, trusted origin, and
                                      exact callback URI.

  Session disappears after refresh    Check Better Auth cookie
                                      configuration, API origin, and
                                      credentialed requests.

  Dashboard shows `401`               Check session validity and JWT
                                      retrieval.

  Dashboard shows `403`               Confirm the authenticated user's
                                      actual database role.

  Equipment list is empty             Check the equipment API and whether
                                      approved listings exist.

  Checkout cannot start               Check the backend payment endpoint,
                                      Stripe configuration, and booking
                                      reservation status.

  Payment remains pending             Check webhook delivery and backend
                                      payment verification.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 📌 Project Status

GearNest's client is organized around the public marketplace and the
Customer, Owner, and Admin experiences. The final production status
depends on the connected backend, configured credentials, deployment,
and end-to-end testing.

  Area                         Status to verify
  ---------------------------- -------------------------------------------
  Public marketplace UI        Implemented in client
  Customer dashboard UI        Implemented in client
  Owner dashboard UI           Implemented in client
  Admin dashboard UI           Implemented in client
  Authentication integration   Requires configured Better Auth server
  Database-backed operations   Requires Express and MongoDB
  Stripe payment flow          Requires Checkout and webhook integration
  Production deployment        Add URL after deployment verification

------------------------------------------------------------------------

## 📋 Assignment Submission Checklist

-   [ ] Client repository published to GitHub.
-   [ ] At least 20 meaningful client commits.
-   [ ] Server repository published to GitHub.
-   [ ] At least 12 meaningful server commits.
-   [ ] README includes project purpose, live URL, key features, and npm
    packages.
-   [ ] Frontend configuration uses environment variables.
-   [ ] MongoDB credentials are stored only in the backend environment.
-   [ ] Production frontend and backend are deployed.
-   [ ] Direct route refresh works.
-   [ ] Authenticated users remain signed in after refresh.
-   [ ] Customer, Owner, and Admin permissions are tested.
-   [ ] Stripe test-mode checkout and webhook flow are verified.

------------------------------------------------------------------------

::: {align="center"}
### GearNest

**Equipment rental, made simpler.**

Built with Next.js, React, and a focus on a clear rental experience.

[Back to
repository](https://github.com/iRfANhAiDeRABiR/b14-A-009-client)
:::
