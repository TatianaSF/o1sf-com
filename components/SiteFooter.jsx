import Link from "next/link";

import { GITHUB_REPO_URL } from "../lib/seo";
import { SiteSignature } from "./SiteSignature";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/#reality" prefetch={false}>
            Reality
          </Link>
          <Link href="/#other-side" prefetch={false}>
            Other Side
          </Link>
          <Link href="/#experience" prefetch={false}>
            Experience
          </Link>
          <Link href="/#filter" prefetch={false}>
            Filter
          </Link>
          <Link href="/#outcome" prefetch={false}>
            Outcome
          </Link>
          <Link href="/sections" prefetch={false}>
            Sections
          </Link>
          <a href={GITHUB_REPO_URL} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </div>
        <div className="footer-copy">
          <SiteSignature className="footer-signature" />
        </div>
      </div>
    </footer>
  );
}
