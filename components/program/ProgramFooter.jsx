import Link from "next/link";

import { programBasePath, programNav } from "../../lib/program-content";

export function ProgramFooter() {
  return (
    <footer className="program-footer">
      <div className="program-footer-inner">
        <div>
          <Link className="program-footer-brand" href={programBasePath} prefetch={false}>O1SF AI Guide</Link>
          <p>A draft guide to the O1SF U.S. Market Entry Program.</p>
        </div>
        <nav aria-label="Program footer navigation">
          {programNav.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>{item.label}</Link>
          ))}
          <Link href={`${programBasePath}/partners`} prefetch={false}>Partners</Link>
          <Link href={`${programBasePath}/privacy-security`} prefetch={false}>Privacy &amp; security</Link>
          <Link href={`${programBasePath}/claims`} prefetch={false}>Claims standard</Link>
          <Link href={`${programBasePath}/requirements`} prefetch={false}>Requirements</Link>
        </nav>
        <p className="program-footer-note">
          OpenAISF Inc. is the proposed contracting entity, subject to final verification. The signed Participation Agreement controls final legal terms.
        </p>
      </div>
    </footer>
  );
}
