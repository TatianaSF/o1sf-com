"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { TATIANA_SEARCH_URL } from "../lib/seo";
import { SiteSignature } from "./SiteSignature";

const navItems = [
  { label: "Frame", href: "/#hero" },
  { label: "Standard", href: "/#other-side" },
  { label: "Filter", href: "/#filter" },
  { label: "TatianaSF", href: TATIANA_SEARCH_URL, external: true },
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
  const renderNavLink = ({ label, href, external }) => {
    if (external) {
      return (
        <a key={href} href={href} rel="noopener noreferrer" target="_blank" onClick={closeMenu}>
          {label}
        </a>
      );
    }

    return (
      <Link key={href} href={href} prefetch={false} onClick={closeMenu}>
        {label}
      </Link>
    );
  };

  return (
    <header className="site-header">
      <div className="nav-shell" data-menu-open={menuOpen}>
        <div className="nav-primary-row">
          <SiteSignature
            className="header-signature"
            showMadeWith={false}
            showProvenance={false}
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
          {navItems.map(renderNavLink)}
        </nav>
        <Link className="nav-cta" href="/sections" prefetch={false}>
          Archive
        </Link>
        <div
          className="mobile-menu"
          id="mobile-menu"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          {menuOpen ? (
            <>
              <nav className="mobile-nav-links" aria-label="Mobile main menu">
                {navItems.map(renderNavLink)}
              </nav>
              <Link
                className="button primary mobile-menu-cta"
                href="/sections"
                prefetch={false}
                onClick={closeMenu}
              >
                Open Archive
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
