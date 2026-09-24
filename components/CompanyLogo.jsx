const logoPaths = {
  apple:
    "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
  paypal:
    "M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z",
  ycombinator:
    "M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z",
};

function OpenAILogo() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M10.3 3.1a4.2 4.2 0 0 1 6.7 2.3 4.23 4.23 0 0 1 3.02 6.3 4.2 4.2 0 0 1-1.76 6.96 4.2 4.2 0 0 1-6.55 2.29 4.2 4.2 0 0 1-6.74-2.28 4.2 4.2 0 0 1-3.03-6.35 4.2 4.2 0 0 1 1.77-6.95 4.2 4.2 0 0 1 6.59-2.27Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="m7.1 8.2 4.9-2.82 4.9 2.82v5.62L12 16.65l-4.9-2.83V8.2Zm4.9 8.45V21m4.9-7.18 3.3 1.9M16.9 8.2l3.3-1.9M7.1 8.2 3.8 6.3m3.3 7.52-3.3 1.9M12 5.38V1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M2 2h9v9H2z" fill="#f25022" />
      <path d="M13 2h9v9h-9z" fill="#7fba00" />
      <path d="M2 13h9v9H2z" fill="#00a4ef" />
      <path d="M13 13h9v9h-9z" fill="#ffb900" />
    </svg>
  );
}

function ChimeLogo() {
  return (
    <svg className="company-wordmark company-wordmark-chime" viewBox="0 0 76 24">
      <text x="38" y="17" textAnchor="middle">
        Chime
      </text>
    </svg>
  );
}

function DNAnexusLogo() {
  return (
    <svg className="company-wordmark company-wordmark-dnanexus" viewBox="0 0 92 24">
      <path
        d="M3 4c8 0 8 16 16 16M3 20c8 0 8-16 16-16M6 8h10M6 16h10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <text x="23" y="16.5">DNAnexus</text>
    </svg>
  );
}

export function CompanyLogo({ company, className = "" }) {
  const classes = ["company-logo", `company-logo-${company}`, className]
    .filter(Boolean)
    .join(" ");

  let logo;

  if (company === "openai") logo = <OpenAILogo />;
  else if (company === "microsoft") logo = <MicrosoftLogo />;
  else if (company === "chime") logo = <ChimeLogo />;
  else if (company === "dnanexus") logo = <DNAnexusLogo />;
  else {
    const fill = company === "paypal" ? "#002991" : company === "ycombinator" ? "#f0652f" : "#111111";
    logo = (
      <svg viewBox="0 0 24 24">
        <path d={logoPaths[company]} fill={fill} />
      </svg>
    );
  }

  return (
    <span aria-hidden="true" className={classes}>
      {logo}
    </span>
  );
}
