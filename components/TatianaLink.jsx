import Link from "next/link";

import { TATIANA_ENTITY_PATH } from "../lib/seo";

export function TatianaLink({ className }) {
  const classes = ["tatiana-link", className].filter(Boolean).join(" ");

  return (
    <Link className={classes} href={TATIANA_ENTITY_PATH} prefetch={false}>
      TatianaSF
    </Link>
  );
}
