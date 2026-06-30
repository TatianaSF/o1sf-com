import { TATIANA_URL } from "../lib/seo";

export function TatianaLink({ className }) {
  const classes = ["tatiana-link", className].filter(Boolean).join(" ");

  return (
    <a
      className={classes}
      href={TATIANA_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      TatianaSF
    </a>
  );
}
