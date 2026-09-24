const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
};

export function SfActivityIcon({ name }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48">
      {name === "meetings" ? (
        <>
          <circle cx="16" cy="18" r="4.5" {...strokeProps} />
          <circle cx="32" cy="18" r="4.5" {...strokeProps} />
          <path d="M7.5 35c.8-6 4-9 8.5-9s7.7 3 8.5 9M23.5 35c.8-6 4-9 8.5-9s7.7 3 8.5 9M18.5 9.5h11l4-3v8h-15a2.5 2.5 0 0 1 0-5Z" {...strokeProps} />
        </>
      ) : null}

      {name === "discovery" ? (
        <>
          <circle cx="21" cy="21" r="12" {...strokeProps} />
          <path d="m30 30 9.5 9.5M16.5 25.5c.7-3.2 2.2-4.8 4.5-4.8s3.8 1.6 4.5 4.8M21 14.5a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z" {...strokeProps} />
        </>
      ) : null}

      {name === "ecosystem" ? (
        <>
          <circle cx="24" cy="11" r="4" {...strokeProps} />
          <circle cx="10.5" cy="34.5" r="4" {...strokeProps} />
          <circle cx="37.5" cy="34.5" r="4" {...strokeProps} />
          <circle cx="24" cy="27" r="5" {...strokeProps} />
          <path d="m22 15-5.3 8.2M26 15l5.3 8.2M14.5 33.5l4.6-3.3M33.5 33.5l-4.6-3.3" {...strokeProps} />
        </>
      ) : null}

      {name === "coworking" ? (
        <>
          <rect height="18" rx="2" width="30" x="9" y="16" {...strokeProps} />
          <path d="M5 39h38M18 39l1.5-5h9L30 39M17 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM38 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM12 24h6M30 24h6" {...strokeProps} />
        </>
      ) : null}

      {name === "demo" ? (
        <>
          <path d="M7 9h34v25H7zM17 41l7-7 7 7M24 34v7" {...strokeProps} />
          <path d="m14 27 6-6 5 4 9-10M29 15h5v5" {...strokeProps} />
        </>
      ) : null}

      {name === "testing" ? (
        <>
          <circle cx="22" cy="24" r="15" {...strokeProps} />
          <circle cx="22" cy="24" r="9" {...strokeProps} />
          <circle cx="22" cy="24" r="3" {...strokeProps} />
          <path d="m24.5 21.5 12-12M31.5 9.5h5v5M35 28.5l5 3-5 3M7 13.5l-4 3.5 4 3.5" {...strokeProps} />
        </>
      ) : null}
    </svg>
  );
}
