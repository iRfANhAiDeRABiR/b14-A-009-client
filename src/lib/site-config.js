export const SITE_CONFIG = {
  name: "GearNest",
  tagline: "Precision Equipment, Ready on Demand.",
  description:
    "Connect with verified local equipment owners to rent construction machinery, cinema optics, field vehicles, and event systems with transparent pricing and insured checkout.",
  navLinks: [
    { label: "Home", href: "/" },
    { label: "All Equipment", href: "/equipment" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  authLinks: {
    login: { label: "Login", href: "/login" },
    register: { label: "Register", href: "/register" },
    dashboard: { label: "Dashboard", href: "/dashboard" },
  },
  footerColumns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "All Equipment", href: "/equipment" },
        { label: "About Us", href: "/about" },
        { label: "How It Works", href: "/how-it-works" },
      ],
    },
    {
      title: "Categories",
      links: [
        { label: "Construction Equipment", href: "/equipment?category=construction" },
        { label: "Photography Equipment", href: "/equipment?category=photography" },
        { label: "Agriculture Equipment", href: "/equipment?category=agriculture" },
        { label: "Vehicles & Transportation", href: "/equipment?category=vehicles" },
        { label: "Electronics", href: "/equipment?category=electronics" },
        { label: "Event Equipment", href: "/equipment?category=event" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Help Center", href: "/help-center" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ],
  equipmentHighlights: [
    {
      label: "Cinema & Optics",
      rate: "From $95 / day",
      location: "Verified Studio Fleet",
    },
    {
      label: "Site & Power Tools",
      rate: "From $48 / day",
      location: "Inspected Before Dispatch",
    },
    {
      label: "Field Lighting & Rigging",
      rate: "From $65 / day",
      location: "Flexible Daily & Weekly Terms",
    },
  ],
  marketplacePillars: [
    {
      title: "Verified Local Fleet",
      description:
        "Every listing passes owner verification and spec review before appearing on the marketplace.",
    },
    {
      title: "Flexible Rental Windows",
      description:
        "Book equipment by the day, week, or month with transparent availability and quantity checks.",
    },
    {
      title: "Protected Checkout",
      description:
        "Confirm rental dates in seconds and complete transactions securely through Stripe Checkout.",
    },
  ],
};
