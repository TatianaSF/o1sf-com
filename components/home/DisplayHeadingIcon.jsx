const iconPaths = {
  payingCustomers: (
    <>
      <path d="M28 10.5c-2.1-2.25-5.15-3.45-8.1-2.95-3.45.58-6.15 3.1-6.15 6.65 0 4.2 3.5 5.72 8.2 7.1 4.4 1.3 8.3 2.85 8.3 7.25 0 3.8-3.2 6.5-7.45 7.08-3.68.5-7.48-.82-9.8-3.65" />
      <path d="M22 3.5v5M22 35.75v8.75" />
      <path d="M35.25 17.25a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Z" />
      <path d="M31.1 44.25v-2.8a7.35 7.35 0 0 1 7.35-7.35h1.3a7.35 7.35 0 0 1 4.75 1.73" />
    </>
  ),
  evidence: (
    <>
      <path d="M11 5.5h18l8 8v29H11Z" />
      <path d="M29 5.5v8h8M17 23h14M17 29h9" />
      <path d="m17 36 3.1 3.1 7-7" />
      <circle cx="38.5" cy="31.5" r="6" />
      <path d="m42.75 35.75 3.75 3.75" />
    </>
  ),
  program: (
    <>
      <rect x="5.5" y="9.5" width="37" height="33" rx="4" />
      <path d="M5.5 18.5h37M15 5v9M33 5v9" />
      <path d="M13 25h6v6h-6zM22 25h6v6h-6zM31 25h6v6h-6z" />
      <path d="M13 35h6M22 35h6M31 35h6" />
    </>
  ),
  marketTest: (
    <>
      <circle cx="22" cy="25" r="17" />
      <circle cx="22" cy="25" r="9" />
      <circle cx="22" cy="25" r="2.5" />
      <path d="M25 22 43 4M34.5 4H43v8.5" />
      <path d="M36 32.5a18.5 18.5 0 0 1-6 7M8 17.5a17.5 17.5 0 0 1 6-6" />
    </>
  ),
  roadmap: (
    <>
      <circle cx="8" cy="37" r="3.5" />
      <circle cx="21" cy="25" r="3.5" />
      <circle cx="34" cy="13" r="3.5" />
      <path d="m10.75 34.75 7.5-7M23.75 22.75l7.5-7" />
      <path d="M37.5 5.5h7v10h-7M34 13h3.5" />
      <path d="M7.75 8.5v14.75M7.75 8.5h10l-2.5 4 2.5 4h-10" />
    </>
  ),
  sanFrancisco: (
    <>
      <path d="M4 39.5h40M8 39.5V26M40 39.5V26" />
      <path d="M12 39.5V11M36 39.5V11M8 26c7 0 8.5-9 16-9s9 9 16 9" />
      <path d="M12 16h24M17 22v17.5M24 18v21.5M31 22v17.5" />
      <path d="M9 11h6M33 11h6" />
    </>
  ),
  support: (
    <>
      <circle cx="24" cy="14" r="6" />
      <circle cx="10" cy="20" r="4.5" />
      <circle cx="38" cy="20" r="4.5" />
      <path d="M13.5 42v-5.5A10.5 10.5 0 0 1 24 26a10.5 10.5 0 0 1 10.5 10.5V42" />
      <path d="M3.5 41v-4.5a7 7 0 0 1 7-7h2M44.5 41v-4.5a7 7 0 0 0-7-7h-2" />
    </>
  ),
  network: (
    <>
      <circle cx="24" cy="8" r="4.5" />
      <circle cx="8" cy="24" r="4.5" />
      <circle cx="40" cy="24" r="4.5" />
      <circle cx="16" cy="40" r="4.5" />
      <circle cx="32" cy="40" r="4.5" />
      <path d="m20.75 11.25-9.5 9.5M27.25 11.25l9.5 9.5M10 28l4 8M38 28l-4 8M20.5 40h7" />
      <circle cx="24" cy="24" r="4" />
      <path d="M24 12.5V20M12.5 24H20M28 24h7.5M21.5 27.5l-3 8M26.5 27.5l3 8" />
    </>
  ),
  pricing: (
    <>
      <path d="M5 8.5h22l16 16-18.5 18.5L5 23.5Z" />
      <circle cx="14" cy="17.5" r="3.5" />
      <path d="M31 20.5c-1.2-1.2-3.1-1.65-4.75-1.05-1.6.58-2.65 1.82-2.65 3.45 0 2.3 2 3.05 4.35 3.8 2.25.72 4.45 1.55 4.45 3.95 0 1.95-1.55 3.45-3.75 3.85-2 .35-4.25-.35-5.55-1.65" />
      <path d="M28 16.5v3M28 34.5v3" />
    </>
  ),
  resources: (
    <>
      <rect x="7" y="5.5" width="27" height="37" rx="3" />
      <path d="M14 5.5v-2h13v2M14 15h13M14 22h13M14 29h8" />
      <path d="m10.5 15 1.5 1.5 3-3M10.5 22l1.5 1.5 3-3M10.5 29l1.5 1.5 3-3" />
      <circle cx="37" cy="34" r="8" />
      <path d="M34.5 31.5a2.8 2.8 0 1 1 4.2 2.42c-1.2.7-1.7 1.2-1.7 2.08M37 39.5h.01" />
    </>
  ),
  fit: (
    <>
      <circle cx="24" cy="24" r="19" />
      <circle cx="24" cy="24" r="4" />
      <path d="m28 20 7-7-3 10-8 5-7 7 3-10Z" />
      <path d="M24 5v4M24 39v4M5 24h4M39 24h4" />
    </>
  ),
  faq: (
    <>
      <path d="M5 7.5h28a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5H18l-8 7v-7H5Z" />
      <path d="M18 16.5a5 5 0 1 1 7.25 4.48C23.3 22 22 23 22 25M22 28.5h.01" />
      <path d="M38 18.5h2a4 4 0 0 1 4 4v13h-5l-6 5v-8" />
    </>
  ),
};

export function DisplayHeadingIcon({ name }) {
  const paths = iconPaths[name];

  if (!paths) return null;

  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      viewBox="0 0 48 48"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.35"
      >
        {paths}
      </g>
    </svg>
  );
}
