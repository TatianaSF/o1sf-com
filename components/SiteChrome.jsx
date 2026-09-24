"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteChrome({ children }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/923hy") || pathname?.startsWith("/tatianasf/assistant")) {
    return children;
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
