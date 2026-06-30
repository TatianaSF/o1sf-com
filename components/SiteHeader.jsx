"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteSignature } from "./SiteSignature";

const navItems = [
  ["Home", "/#hero"],
  ["Reality", "/#reality"],
  ["Other Side", "/#other-side"],
  ["Experience", "/#experience"],
  ["Filter", "/#filter"],
  ["Outcome", "/#outcome"],
  ["Sections", "/sections"],
];

function MenuIcon({ open }) {
  return (
    <svg aria-hidden="true" className="menu-icon" viewBox="0 0 24 24">
      {open ? (
        <path
          d="m6.5 6.5 11 11m0-11-11 11"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      ) : (
        <path
          d="M4.5 7h15M4.5 12h15M4.5 17h15"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="nav-shell" data-menu-open={menuOpen}>
        <div className="nav-primary-row">
          <SiteSignature
            className="header-signature"
            showBuiltWithStack
            showMadeWith={false}
          />
          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close main menu" : "Open main menu"}
            className="mobile-menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
        <nav className="nav-links desktop-nav" aria-label="Main menu">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} prefetch={false}>
              {label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/sections" prefetch={false}>
          View Sections
        </Link>
        <div className="mobile-menu" id="mobile-menu" aria-hidden={!menuOpen}>
          <nav className="mobile-nav-links" aria-label="Mobile main menu">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                tabIndex={menuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            className="button primary mobile-menu-cta"
            href="/sections"
            prefetch={false}
            tabIndex={menuOpen ? 0 : -1}
            onClick={closeMenu}
          >
            View Sections
          </Link>
        </div>
      </div>
    </header>
  );
}
