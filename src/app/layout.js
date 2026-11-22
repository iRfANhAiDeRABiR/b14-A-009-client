import { Inter, Manrope } from "next/font/google";
import { MainLayout } from "@/components/layout/MainLayout";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GearNest | Equipment Rental Marketplace",
    template: "%s | GearNest",
  },
  description:
    "Discover and rent construction, photography, agriculture and event equipment through GearNest.",
  applicationName: "GearNest",
  keywords: [
    "GearNest",
    "equipment rental",
    "construction machinery",
    "cinema cameras",
    "agricultural machinery",
    "event gear",
  ],
  icons: {
    icon: [
      { url: "/icons/gearnest-mark.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "GearNest",
    title: "GearNest | Equipment Rental Marketplace",
    description:
      "Discover and rent construction, photography, agriculture and event equipment through GearNest.",
    images: [
      {
        url: "/images/hero-excavator.jpg",
        width: 1200,
        height: 900,
        alt: "GearNest commercial equipment marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GearNest | Equipment Rental Marketplace",
    description:
      "Discover and rent construction, photography, agriculture and event equipment through GearNest.",
    images: ["/images/hero-excavator.jpg"],
  },
};

const THEME_INIT_SCRIPT = `(function(){try{var k="gearnest-theme";var t=localStorage.getItem(k);if(t!=="dark"&&t!=="light"){t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;document.documentElement.classList.toggle("dark",t==="dark");}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-md"
        >
          Skip to main content
        </a>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
