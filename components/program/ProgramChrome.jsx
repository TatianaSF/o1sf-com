"use client";

import { usePathname } from "next/navigation";

import { ProgramFooter } from "./ProgramFooter";
import { ProgramHeader } from "./ProgramHeader";

export function ProgramChrome({ children }) {
  const pathname = usePathname();
  const normalizedPathname = pathname?.replace(/\/+$/, "") || "/";

  if (normalizedPathname === "/923hy") {
    return children;
  }

  return (
    <div className="program-site">
      <a className="program-skip-link" href="#program-main">Skip to program content</a>
      <ProgramHeader />
      <main id="program-main">{children}</main>
      <ProgramFooter />
    </div>
  );
}
