import Link from "next/link";

import { programBasePath, programNav } from "../../lib/program-content";

export function ProgramHeader() {
  return (
    <>
      <div className="program-draft-bar" role="note">
        <span>Program information v3.1 Draft</span>
        <span>Final terms remain subject to verification and signed agreements.</span>
      </div>
      <header className="program-header">
        <div className="program-header-inner">
          <Link className="program-brand" href={programBasePath} prefetch={false}>
            <span className="program-brand-mark" aria-hidden="true">O1</span>
            <span>
              <strong>O1SF AI Guide</strong>
              <small>U.S. Market Entry</small>
            </span>
          </Link>
          <nav className="program-desktop-nav" aria-label="Program navigation">
            {programNav.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="program-button program-button-primary program-header-cta" href={`${programBasePath}/apply`} prefetch={false}>
            Check program fit
          </Link>
          <details className="program-mobile-menu">
            <summary aria-label="Open program navigation">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile program navigation">
              {programNav.map((item) => (
                <Link key={item.href} href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              ))}
              <Link className="program-button program-button-primary" href={`${programBasePath}/apply`} prefetch={false}>
                Check program fit
              </Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
