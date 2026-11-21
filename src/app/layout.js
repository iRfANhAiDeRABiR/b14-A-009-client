import { Inter, Manrope } from "next/font/google";
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

export const metadata = {
  title: {
    default: "GearNest — Precision Equipment Rental Marketplace",
    template: "%s | GearNest",
  },
  description:
    "Rent pro-grade construction, cinema, agricultural, vehicle, and event equipment from verified local owners with transparent pricing and secure checkout.",
  icons: {
    icon: "/icons/gearnest-mark.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-md"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
