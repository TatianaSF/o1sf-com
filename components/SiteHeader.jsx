"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteSignature } from "./SiteSignature";

const navItems = [
  { id: "program", label: "Program", href: "/program" },
  { id: "methodology", label: "Method", href: "/methodology" },
  { id: "pricing", label: "Pricing", href: "/pricing" },
  { id: "resources", label: "Resources", href: "/resources" },
  { id: "host", label: "Host", href: "/tatianasf" },
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
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const renderNavLink = ({ id, label, href }, linkLocation) => (
    <Link
      data-analytics-destination={href}
      data-analytics-event="site_navigation_click"
      data-analytics-link-id={id}
      data-analytics-link-location={linkLocation}
      data-analytics-surface="site_chrome"
      href={href}
      key={href}
      onClick={closeMenu}
      prefetch={false}
    >
      {label}
    </Link>
  );

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
          {navItems.map((item) => renderNavLink(item, "desktop_header"))}
        </nav>
        <div
          aria-hidden={!menuOpen}
          className={`mobile-menu${menuOpen ? " mobile-menu-open" : ""}`}
          id="mobile-menu"
          inert={!menuOpen}
        >
          {menuOpen ? (
            <nav className="mobile-nav-links" aria-label="Mobile main menu">
              {navItems.map((item) => renderNavLink(item, "mobile_menu"))}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
