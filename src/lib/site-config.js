export const SITE_CONFIG = {
  name: "GearNest",
  tagline: "Precision Equipment, Ready on Demand.",
  description:
    "Discover and rent quality equipment for construction, agriculture, photography and events. Get the right tools when you need them, without the cost of ownership.",
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
  hero: {
    eyebrow: "THE SMARTER WAY TO RENT",
    headlineTop: "Power Your Projects.",
    headlineAccent: "Without Buying Equipment.",
    description:
      "Discover and rent quality equipment for construction, agriculture, photography and events. Get the right tools when you need them, without the cost of ownership.",
    primaryCta: { label: "Explore Equipment", href: "/equipment" },
    secondaryCta: { label: "List Your Equipment", href: "/register" },
    trustIndicators: [
      {
        id: "flexible-rental-periods",
        title: "Flexible Rental Periods",
        subtitle: "Daily, weekly, and monthly booking options",
      },
      {
        id: "trusted-equipment-owners",
        title: "Trusted Equipment Owners",
        subtitle: "Verified fleet profiles and transparent terms",
      },
      {
        id: "transparent-pricing",
        title: "Transparent Pricing",
        subtitle: "Upfront rates with zero hidden fees",
      },
    ],
    visual: {
      imageSrc: "/images/hero-excavator.jpg",
      imageAlt:
        "Commercial hydraulic construction excavator positioned at an active daylight job site",
      availabilityLabel: "Available Now",
      cardCategory: "Construction Machinery",
      cardTitle: "Hydraulic Site Excavator",
      cardRate: "$285",
      cardUnit: "/ day",
      cardMeta: "Daily · Weekly · Monthly",
      cardLocation: "Verified Fleet Ready",
    },
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
        { label: "Construction Equipment", href: "/equipment?category=Construction%20Equipment" },
        { label: "Photography Equipment", href: "/equipment?category=Photography%20Equipment" },
        { label: "Agriculture Equipment", href: "/equipment?category=Agriculture%20Equipment" },
        { label: "Vehicles & Transportation", href: "/equipment?category=Vehicles%20%26%20Transportation" },
        { label: "Electronics", href: "/equipment?category=Electronics" },
        { label: "Event Equipment", href: "/equipment?category=Event%20Equipment" },
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
};
