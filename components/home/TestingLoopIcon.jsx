const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
};

export function TestingLoopIcon({ name }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48">
      {name === "hypothesis" ? (
        <>
          <path d="M24 5v4M24 39v4M5 24h4M39 24h4M10.6 10.6l2.8 2.8M34.6 34.6l2.8 2.8M37.4 10.6l-2.8 2.8M13.4 34.6l-2.8 2.8" {...iconProps} />
          <path d="M18.7 20.1a5.5 5.5 0 1 1 8.8 4.4c-2.2 1.6-3.5 2.8-3.5 5" {...iconProps} />
          <circle cx="24" cy="35" fill="currentColor" r="1.4" stroke="none" />
        </>
      ) : null}

      {name === "asset" ? (
        <>
          <path d="M13 8.5h16l6 6V36a3.5 3.5 0 0 1-3.5 3.5h-18A3.5 3.5 0 0 1 10 36V12a3.5 3.5 0 0 1 3-3.5Z" {...iconProps} />
          <path d="M29 8.5V15h6M15.5 19h12M15.5 24h8" {...iconProps} />
          <path d="m23.5 34.5 2.2-6.3 9.1-9.1a2.3 2.3 0 0 1 3.2 3.2l-9.1 9.1-5.4 3.1Z" {...iconProps} />
        </>
      ) : null}

      {name === "interaction" ? (
        <>
          <path d="M10 22.5v-5l22-8v21l-22-8Z" {...iconProps} />
          <path d="M10 17.5H6.5a3.5 3.5 0 0 0 0 7H10M15 24.5l2.5 12h6l-2.1-14.1M37 14l4-3M38.5 20H43M37 26l4 3" {...iconProps} />
        </>
      ) : null}

      {name === "feedback" ? (
        <>
          <path d="M8 11.5h32v22H22l-8 6v-6H8a4 4 0 0 1-4-4v-14a4 4 0 0 1 4-4Z" {...iconProps} />
          <path d="M11 23v-3M16 26v-9M21 24v-5M26 27V16M31 24v-5M36 23v-3" {...iconProps} />
        </>
      ) : null}

      {name === "iterate" ? (
        <>
          <path d="M11.2 18A14 14 0 0 1 35 12.6l2.3 3.2" {...iconProps} />
          <path d="m38 8.5-.7 7.3-7.2-.7M36.8 30A14 14 0 0 1 13 35.4l-2.3-3.2" {...iconProps} />
          <path d="m10 39.5.7-7.3 7.2.7" {...iconProps} />
        </>
      ) : null}

      {name === "action" ? (
        <>
          <rect height="33" rx="3" width="28" x="10" y="10.5" {...iconProps} />
          <path d="M19 10.5V8a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 29 8v2.5M18 20l2 2 4-4M27.5 20h5M18 29l2 2 4-4M27.5 29h5M18 38l2 2 4-4M27.5 38h5" {...iconProps} />
        </>
      ) : null}
    </svg>
  );
}
