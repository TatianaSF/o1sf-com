import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SiteChrome({ children }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
