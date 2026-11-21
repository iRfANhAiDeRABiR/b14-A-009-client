"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function PublicNavbarSlot() {
  const pathname = usePathname() || "/";
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return null;
  }
  return <Navbar />;
}

export function PublicFooterSlot() {
  const pathname = usePathname() || "/";
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return null;
  }
  return <Footer />;
}
