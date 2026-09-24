"use client";

import Link from "next/link";
import { useEffect } from "react";

import styles from "./ask-document.module.css";

const canonicalPath = "/923hy";

export function LegacyAskDocumentRedirect() {
  useEffect(() => {
    const nextTarget = `${canonicalPath}${window.location.search}${window.location.hash}`;
    window.location.replace(nextTarget);
  }, []);

  return (
    <main className={styles.legacyRedirect}>
      <span className={styles.demoBadge}>Interactive Demo</span>
      <h1>This demo has moved.</h1>
      <p>Taking you to the O1SF program document experience.</p>
      <Link href={canonicalPath}>Continue to the interactive document</Link>
    </main>
  );
}
