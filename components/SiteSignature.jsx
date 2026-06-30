import Image from "next/image";
import Link from "next/link";

import { TatianaLink } from "./TatianaLink";

function OpenAIIcon() {
  return (
    <svg
      aria-hidden="true"
      className="signature-icon openai-icon"
      viewBox="0 0 24 24"
    >
      <path
        d="M10.3 3.1a4.2 4.2 0 0 1 6.7 2.3 4.23 4.23 0 0 1 3.02 6.3 4.2 4.2 0 0 1-1.76 6.96 4.2 4.2 0 0 1-6.55 2.29 4.2 4.2 0 0 1-6.74-2.28 4.2 4.2 0 0 1-3.03-6.35 4.2 4.2 0 0 1 1.77-6.95 4.2 4.2 0 0 1 6.59-2.27Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m7.1 8.2 4.9-2.82 4.9 2.82v5.62L12 16.65l-4.9-2.83V8.2Zm4.9 8.45V21m4.9-7.18 3.3 1.9M16.9 8.2l3.3-1.9M7.1 8.2 3.8 6.3m3.3 7.52-3.3 1.9M12 5.38V1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function CodexIcon() {
  return (
    <svg
      aria-hidden="true"
      className="signature-icon codex-icon"
      viewBox="0 0 24 24"
    >
      <rect width="22" height="22" x="1" y="1" fill="#7357ff" rx="7" />
      <path
        d="m9.3 8.2 3.75 3.8-3.75 3.8M14 15.9h3.35"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

export function SiteSignature({
  className,
  showBuiltWithStack = false,
  showMadeWith = true,
}) {
  const classes = ["site-signature", className].filter(Boolean).join(" ");
  const label =
    showMadeWith || showBuiltWithStack
      ? "O1SF built with OpenAI Codex by TatianaSF"
      : "O1SF OpenAI Codex by TatianaSF";

  return (
    <div className={classes} aria-label={label}>
      <Link className="site-signature-logo-link" href="/" aria-label="O1SF home">
        <Image
          alt=""
          aria-hidden="true"
          className="site-signature-mark"
          height="48"
          src="/codexsf-mark.png"
          width="48"
        />
        <span className="site-signature-brand">O1SF</span>
      </Link>
      {showMadeWith ? <span>Made with</span> : null}
      {showBuiltWithStack ? (
        <span className="signature-built-with">
          <span>Built</span>
          <span>with</span>
        </span>
      ) : null}
      <OpenAIIcon />
      <strong>OpenAI</strong>
      <span className="signature-separator" aria-hidden="true" />
      <CodexIcon />
      <strong>Codex</strong>
      <span>by</span>
      <TatianaLink />
    </div>
  );
}
