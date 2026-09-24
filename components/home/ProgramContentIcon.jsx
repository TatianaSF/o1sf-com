const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
};

const iconPaths = {
  diagnose: (
    <>
      <circle cx="20" cy="20" r="12" />
      <path d="m29 29 10 10M13 20h14M20 13c-3 3.8-3 10.2 0 14M20 13c3 3.8 3 10.2 0 14M13.5 16h13M13.5 24h13" />
      <path d="m34 8 2.2 4.8L41 15l-4.8 2.2L34 22l-2.2-4.8L27 15l4.8-2.2L34 8Z" />
    </>
  ),
  prepare: (
    <>
      <rect x="10" y="8" width="27" height="34" rx="3" />
      <path d="M17 8V5h13v3M16 18l2.5 2.5L23 16M27 19h5M16 28l2.5 2.5L23 26M27 29h5M16 37h12" />
      <path d="m34 33 7-7M36 26h5v5" />
    </>
  ),
  execute: (
    <>
      <path d="M24 43s12-11.2 12-22A12 12 0 0 0 12 21c0 10.8 12 22 12 22Z" />
      <circle cx="24" cy="21" r="5" />
      <path d="M4 12h8l4-4v10H8a4 4 0 0 1-4-4v-2ZM36 30h8v8a4 4 0 0 1-4 4h-8V32l4 4" />
    </>
  ),
  pitch: (
    <>
      <rect x="6" y="8" width="36" height="27" rx="2" />
      <path d="M15 41l9-6 9 6M24 35v6M13 16h13M13 22h19M13 28h10" />
      <path d="m32 15 2 2 4-5" />
    </>
  ),
  demo: (
    <>
      <path d="M7 9h34v25H7zM17 41l7-7 7 7M24 34v7" />
      <path d="m14 27 6-6 5 4 9-10M29 15h5v5" />
    </>
  ),
  shortPitch: (
    <>
      <rect x="8" y="8" width="16" height="25" rx="8" />
      <path d="M4 24a12 12 0 0 0 24 0M16 36v7M10 43h12" />
      <circle cx="37" cy="19" r="7" />
      <path d="M37 15v4l3 2M33 32h2M39 32h2M45 32h-2" />
    </>
  ),
  targets: (
    <>
      <circle cx="23" cy="24" r="16" />
      <circle cx="23" cy="24" r="10" />
      <circle cx="23" cy="24" r="4" />
      <path d="m26 21 14-14M34 7h6v6" />
      <circle cx="7" cy="10" r="2" />
      <circle cx="41" cy="38" r="2" />
    </>
  ),
  outreach: (
    <>
      <rect x="5" y="15" width="27" height="23" rx="3" />
      <path d="m7 18 11.5 9L30 18M12 10h25a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6h-2v7l-6-7" />
    </>
  ),
  icp: (
    <>
      <path d="M15 6H7v8M33 6h8v8M15 42H7v-8M33 42h8v-8" />
      <circle cx="24" cy="20" r="6" />
      <path d="M12 36c1.2-7 5.2-10 12-10s10.8 3 12 10" />
    </>
  ),
  metric: (
    <>
      <path d="m24 5 3.2 7 7.8.8-5.8 5.3 1.6 7.6-6.8-3.9-6.8 3.9 1.6-7.6-5.8-5.3 7.8-.8L24 5Z" />
      <path d="M7 41V30l8-6 7 8 9-5 10 7M7 41h34" />
    </>
  ),
  gtm: (
    <>
      <circle cx="9" cy="36" r="4" />
      <circle cx="24" cy="22" r="4" />
      <circle cx="39" cy="10" r="4" />
      <path d="M12 33 21 25M27 19l9-7M31 36h10V26M41 26 28 39" />
    </>
  ),
  roadmap: (
    <>
      <path d="M5 34h38M10 34V20M24 34V12M38 34V6" />
      <circle cx="10" cy="18" r="4" />
      <circle cx="24" cy="10" r="4" />
      <circle cx="38" cy="6" r="4" />
      <path d="m9 42 4-4 4 4M23 42l4-4 4 4" />
    </>
  ),
  playbook: (
    <>
      <path d="M6 9h14a8 8 0 0 1 8 8v25H14a8 8 0 0 0-8 0V9ZM42 9H28" />
      <path d="M34 17h5M34 24h5M34 31h5M12 18l2 2 4-5M12 28l2 2 4-5" />
    </>
  ),
  groupSessions: (
    <>
      <rect x="6" y="11" width="36" height="26" rx="3" />
      <path d="M3 42h42M17 42l2-5h10l2 5" />
      <circle cx="16" cy="21" r="3" />
      <circle cx="32" cy="21" r="3" />
      <path d="M11 31c.5-4 2.2-6 5-6s4.5 2 5 6M27 31c.5-4 2.2-6 5-6s4.5 2 5 6" />
    </>
  ),
  strategySession: (
    <>
      <circle cx="13" cy="20" r="5" />
      <circle cx="35" cy="20" r="5" />
      <path d="M4 39c.8-8 3.8-12 9-12s8.2 4 9 12M26 39c.8-8 3.8-12 9-12s8.2 4 9 12" />
      <path d="M16 7h16l5-4v11H16a3.5 3.5 0 0 1 0-7Z" />
    </>
  ),
  mentorGroup: (
    <>
      <circle cx="24" cy="23" r="6" />
      <circle cx="8" cy="9" r="3" />
      <circle cx="40" cy="9" r="3" />
      <circle cx="8" cy="39" r="3" />
      <circle cx="40" cy="39" r="3" />
      <path d="m12 11 7 7M36 11l-7 7M12 37l7-9M36 37l-7-9" />
      <path d="M17 42c.6-6 3-9 7-9s6.4 3 7 9" />
    </>
  ),
  primaryFounder: (
    <>
      <circle cx="20" cy="17" r="7" />
      <path d="M7 41c1-10 5.5-15 13-15s12 5 13 15" />
      <circle cx="36" cy="31" r="9" />
      <path d="m31.5 31 3 3 6-7" />
    </>
  ),
  additionalFounder: (
    <>
      <circle cx="14" cy="18" r="6" />
      <circle cx="31" cy="18" r="6" />
      <path d="M4 40c.7-9 4-14 10-14 4.4 0 7.3 2.6 9 7M22 40c.7-9 3.7-14 9-14 6 0 9.3 5 10 14" />
      <path d="M39 5v10M34 10h10" />
    </>
  ),
  zeroEquity: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 6v18h18M11 37 37 11" />
      <circle cx="16" cy="17" r="3" />
      <circle cx="32" cy="32" r="3" />
    </>
  ),
  noSuccessFee: (
    <>
      <rect x="10" y="6" width="28" height="36" rx="3" />
      <path d="M16 14h16M16 21h11M16 28h8M13 38 36 9" />
      <path d="M32 29c-5 0-5 7 0 7s5-7 0-7Zm0-4v4M32 36v4" />
    </>
  ),
  noInvestmentCommission: (
    <>
      <path d="M7 37h34M11 37V19h26v18M8 19 24 7l16 12H8Z" />
      <path d="M17 25v7M24 25v7M31 25v7M7 42 41 8" />
    </>
  ),
  readinessGuide: (
    <>
      <rect x="7" y="8" width="26" height="34" rx="3" />
      <path d="M14 8V5h12v3M13 18l2.5 2.5L20 16M23 19h5M13 28l2.5 2.5L20 26M23 29h5" />
      <circle cx="36" cy="32" r="8" />
      <path d="M28 32h16M36 24c-2.8 2.4-2.8 13.6 0 16M36 24c2.8 2.4 2.8 13.6 0 16" />
    </>
  ),
  discoveryGuide: (
    <>
      <circle cx="19" cy="18" r="6" />
      <path d="M8 35c.8-7 4.4-11 11-11s10.2 4 11 11" />
      <circle cx="32" cy="29" r="9" />
      <path d="m39 36 6 6M28 14h12a4 4 0 0 1 4 4v4h-7l-4 4v-4h-3" />
    </>
  ),
  gtmGuide: (
    <>
      <circle cx="11" cy="37" r="4" />
      <circle cx="37" cy="11" r="4" />
      <path d="M15 35c8-2 5-12 13-14 5-1.2 7-3.5 7-6M20 17h-9V8M11 8l7 7M28 36h12v-8M40 28 28 40" />
    </>
  ),
  unclearPositioning: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M8 31c5-1 7-5 10-9 2.5-3.3 5.5-5 10-5h8" />
      <path d="m32 12 5 5-5 5M12 37l5-5M12 32l5 5" />
      <path d="M21 23.5c0-2.2 1.5-3.8 3.8-3.8 2.2 0 3.7 1.3 3.7 3.3 0 2.4-2.8 3-3.8 5v1.2M24.7 34h.1" />
    </>
  ),
  untestedMessaging: (
    <>
      <path d="M7 8h27a6 6 0 0 1 6 6v15a6 6 0 0 1-6 6H20L9 43v-8H7a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6Z" />
      <path d="M10 17h16M10 24h11" />
      <path d="M31 18c0-2 1.4-3.5 3.5-3.5S38 15.8 38 17.7c0 2.2-2.6 2.8-3.5 4.7v1M34.5 28h.1" />
    </>
  ),
  limitedAccess: (
    <>
      <circle cx="11" cy="15" r="5" />
      <circle cx="37" cy="15" r="5" />
      <circle cx="24" cy="35" r="5" />
      <path d="M3 29c.7-6 3.4-9 8-9 3.2 0 5.5 1.5 7 4M45 29c-.7-6-3.4-9-8-9-3.2 0-5.5 1.5-7 4M16 43c.7-6 3.4-9 8-9s7.3 3 8 9" />
      <path d="M20 16h8M24 12v8M17 28l4 3M31 28l-4 3" />
      <path d="M20 10 28 22M28 10 20 22" />
    </>
  ),
  unvalidatedPlan: (
    <>
      <path d="M7 6h23l8 8v28H7Z" />
      <path d="M30 6v8h8M13 21h14M13 27h10M13 33h7" />
      <circle cx="37" cy="34" r="9" />
      <path d="M34 31.5c0-1.8 1.2-3 3-3s3 1.1 3 2.8c0 2-2.2 2.4-3 4v1M37 40h.1" />
    </>
  ),
  assumptionStack: (
    <>
      <path d="M7 8h27a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H20l-8 6v-6H7a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z" />
      <path d="M18 34h16a5 5 0 0 0 5-5v-1M24 40h10a5 5 0 0 0 5-5" />
      <path d="M15 15c0-1.8 1.3-3 3.2-3s3.2 1.2 3.2 2.9c0 2-2.3 2.5-3.2 4.2v1M18.2 24h.1M27 17h5M27 22h3" />
    </>
  ),
  testedPositioning: (
    <>
      <circle cx="20" cy="24" r="15" />
      <circle cx="20" cy="24" r="8" />
      <circle cx="20" cy="24" r="2" />
      <path d="m22 22 17-17M33 5h6v6" />
      <path d="M29 33h13v9H29l-5 4v-9" />
      <path d="m33 37 2 2 4-4" />
    </>
  ),
  customerFeedback: (
    <>
      <circle cx="13" cy="16" r="5" />
      <circle cx="35" cy="16" r="5" />
      <path d="M3 34c.7-8 4-12 10-12s9.3 4 10 12M25 34c.7-8 4-12 10-12s9.3 4 10 12" />
      <path d="M13 38h22a5 5 0 0 1 5 5v1H19l-6 4v-4a3 3 0 0 1-3-3 3 3 0 0 1 3-3Z" />
      <path d="M18 42h12" />
    </>
  ),
  warmIntroductions: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="39" cy="14" r="5" />
      <path d="M1 31c.6-7 3.3-11 8-11s7.4 4 8 11M31 31c.6-7 3.3-11 8-11s7.4 4 8 11" />
      <path d="M16 14h16M24 10l4 4-4 4" />
      <rect x="15" y="34" width="18" height="10" rx="2" />
      <path d="M20 39h8" />
    </>
  ),
  gtmMetrics: (
    <>
      <circle cx="8" cy="38" r="3" />
      <circle cx="22" cy="24" r="3" />
      <circle cx="37" cy="10" r="3" />
      <path d="m10 36 10-10M24 22 35 12M31 39h12M33 39V31M38 39V25M43 39V19" />
      <path d="M7 9h13M7 15h9" />
    </>
  ),
  growthRoadmap: (
    <>
      <path d="M5 38h38" />
      <circle cx="10" cy="38" r="4" />
      <circle cx="24" cy="38" r="4" />
      <circle cx="38" cy="38" r="4" />
      <path d="M10 34V20M24 34V13M38 34V6" />
      <path d="M10 20h9l-3-4 3-4h-9M24 13h9l-3-4 3-4h-9M38 6h7l-2-3" />
    </>
  ),
  internationalFounder: (
    <>
      <circle cx="20" cy="23" r="16" />
      <path d="M4 23h32M20 7c-5 5-5 27 0 32M20 7c5 5 5 27 0 32M8 15h24M8 31h16" />
      <circle cx="37" cy="31" r="6" />
      <path d="M27 43c.6-5 4-7 10-7s9.4 2 10 7" />
    </>
  ),
  directFeedback: (
    <>
      <circle cx="15" cy="17" r="6" />
      <path d="M5 36c.8-8 4-12 10-12s9.2 4 10 12" />
      <path d="M26 10h16a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-7l-7 7v-7h-2a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" />
      <path d="M29 17h10M29 23h7" />
    </>
  ),
  workingEnglish: (
    <>
      <path d="M6 9h25a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5H19l-8 7v-7H6a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5Z" />
      <path d="M27 34h7l7 7v-7h1a5 5 0 0 0 5-5v-8a5 5 0 0 0-5-5h-2M9 17h18M9 23h12" />
    </>
  ),
  outreachIterate: (
    <>
      <path d="m5 22 37-15-12 36-7-14-18-7Z" />
      <path d="m23 29 19-22M8 36a16 16 0 0 0 20 8M8 36l1 7M8 36l7-1" />
    </>
  ),
  sanFranciscoAttendance: (
    <>
      <path d="M24 43s12-11.2 12-22A12 12 0 0 0 12 21c0 10.8 12 22 12 22Z" />
      <path d="M16 23h16M18 23c1-7 3-10 6-10s5 3 6 10M19 28h10M20 23v5M28 23v5" />
      <circle cx="24" cy="21" r="7" />
    </>
  ),
};

export function ProgramContentIcon({ name }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48">
      <g {...strokeProps}>{iconPaths[name] ?? null}</g>
    </svg>
  );
}
