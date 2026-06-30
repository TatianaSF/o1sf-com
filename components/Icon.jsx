export function Icon({ name, className = "" }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    className: `icon ${className}`.trim(),
  };

  switch (name) {
    case "role":
      return (
        <svg {...common}>
          <circle cx="24" cy="17" r="7" />
          <path d="M12 39c1.8-8 6-12 12-12s10.2 4 12 12" />
        </svg>
      );
    case "signal":
      return (
        <svg {...common}>
          <path d="M24 6l5.1 11 12 1.4-8.8 8.2 2.3 11.8L24 32.4 13.4 38.4l2.3-11.8-8.8-8.2 12-1.4z" />
        </svg>
      );
    case "story":
      return (
        <svg {...common}>
          <path d="M15 8h14l8 8v24H15z" />
          <path d="M29 8v9h8" />
          <path d="M20 24h13" />
          <path d="M20 31h10" />
        </svg>
      );
    case "room":
      return (
        <svg {...common}>
          <circle cx="18" cy="17" r="5" />
          <circle cx="31" cy="17" r="5" />
          <path d="M8 38c1.5-7 5-10.5 10-10.5S26.5 31 28 38" />
          <path d="M22 38c1.5-6.5 4.6-9.8 9-9.8 4.8 0 8.2 3.3 10 9.8" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M10 12h28L27 25v10l-6 3V25z" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="17" />
          <circle cx="24" cy="24" r="10" />
          <circle cx="24" cy="24" r="3" />
          <path d="M24 7v6" />
          <path d="M24 35v6" />
          <path d="M7 24h6" />
          <path d="M35 24h6" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M12 40V10h16v30" />
          <path d="M28 18h8v22" />
          <path d="M17 16h5" />
          <path d="M17 23h5" />
          <path d="M17 30h5" />
          <path d="M32 25h2" />
          <path d="M32 32h2" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M9 12h30v20H20l-8 6v-6H9z" />
          <path d="M17 21h14" />
          <path d="M17 27h9" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="17" />
          <path d="M18 18l12 12" />
          <path d="M30 18L18 30" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="17" />
          <path d="M24 13v15" />
          <path d="M24 35h.1" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M6 24s6.5-11 18-11 18 11 18 11-6.5 11-18 11S6 24 6 24z" />
          <circle cx="24" cy="24" r="6" />
        </svg>
      );
    case "peopleSignal":
      return (
        <svg {...common}>
          <circle cx="24" cy="15" r="5.5" />
          <circle cx="14" cy="24" r="4.5" />
          <circle cx="34" cy="24" r="4.5" />
          <path d="M11 38c1-6 5.2-9 13-9s12 3 13 9" />
          <path d="M8 14a24 24 0 0 1 32 0" />
          <path d="M12 9a30 30 0 0 1 24 0" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    default:
      return null;
  }
}
