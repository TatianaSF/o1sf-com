export const TATIANA_SEARCH_URL = "https://www.google.com/search?q=TatianaSF";

export function TatianaLink({ className }) {
  const classes = ["tatiana-link", className].filter(Boolean).join(" ");

  return (
    <a
      className={classes}
      href={TATIANA_SEARCH_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      TatianaSF
    </a>
  );
}
