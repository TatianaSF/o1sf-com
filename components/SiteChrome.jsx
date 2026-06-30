"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const isStoryboardHome = pathname === "/";

  return (
    <>
      {isStoryboardHome ? null : <SiteHeader />}
      {children}
      {isStoryboardHome ? null : <SiteFooter />}
    </>
  );
}
