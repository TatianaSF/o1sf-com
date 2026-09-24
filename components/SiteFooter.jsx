import Link from "next/link";

import { SiteSignature } from "./SiteSignature";

export function SiteFooter() {
  return (
    <footer className="footer marketing-footer">
      <div className="footer-inner marketing-footer-inner">
        <nav className="footer-links" aria-label="Footer menu">
          {[
            ["Program", "/program", "program"],
            ["Method", "/methodology", "methodology"],
            ["Pricing", "/pricing", "pricing"],
            ["Resources", "/resources", "resources"],
            ["Host", "/tatianasf", "host"],
            ["FAQ", "/#faq", "faq"],
          ].map(([label, href, linkId]) => (
            <Link
              data-analytics-destination={href}
              data-analytics-event="site_navigation_click"
              data-analytics-link-id={linkId}
              data-analytics-link-location="footer"
              data-analytics-surface="site_chrome"
              href={href}
              key={href}
              prefetch={false}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="footer-legal-row" aria-label="Legal information">
          <details id="privacy-note">
            <summary>Privacy</summary>
            <p>
              This informational website does not include a contact form and does not collect or store
              visitor submissions. It uses privacy-limited site analytics to understand aggregate use.
            </p>
          </details>
          <details id="terms-note">
            <summary>Terms</summary>
            <p>
              Program targets and conditional support are not guarantees of meetings, investment,
              customers, partnerships, visas, formation, banking, or market outcomes.
            </p>
          </details>
        </div>
        <div className="footer-copy">
          <SiteSignature className="footer-signature" />
          <p className="footer-love">
            © {new Date().getFullYear()} O1SF · with love ❤️ from 🌉 San Francisco
          </p>
        </div>
      </div>
    </footer>
  );
}
