export function AskDocumentIcon({ name, className, ...props }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    document: <><path d="M6 2.5h8l4 4V21H6z" /><path d="M14 2.5v4h4" /><path d="M9 11h6" /><path d="M9 15h6" /></>,
    help: <><path d="M9.5 9a2.7 2.7 0 1 1 4.4 2.1c-1 .75-1.9 1.2-1.9 2.4" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    send: <><path d="m4 4 17 8-17 8 3-8z" /><path d="M7 12h14" /></>,
    sparkle: <><path d="M12 3c.5 3 2 4.5 5 5-3 .5-4.5 2-5 5-.5-3-2-4.5-5-5 3-.5 4.5-2 5-5Z" /><path d="M18 14c.25 1.5 1 2.25 2.5 2.5-1.5.25-2.25 1-2.5 2.5-.25-1.5-1-2.25-2.5-2.5 1.5-.25 2.25-1 2.5-2.5Z" /></>,
    thumbsDown: <><path d="M7 4v11" /><path d="M7 5h8.5a2 2 0 0 1 1.9 2.6l-1.7 5.2A3 3 0 0 1 12.85 15H11l.5 3a2 2 0 0 1-2 2L7 15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></>,
    thumbsUp: <><path d="M7 20V9" /><path d="M7 19h8.5a2 2 0 0 0 1.9-2.6l-1.7-5.2A3 3 0 0 0 12.85 9H11l.5-3a2 2 0 0 0-2-2L7 9H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      {...props}
    >
      {paths[name] ?? paths.sparkle}
    </svg>
  );
}

