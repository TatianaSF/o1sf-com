import "./program.css";

import { ProgramFooter } from "../../components/program/ProgramFooter";
import { ProgramHeader } from "../../components/program/ProgramHeader";

export const metadata = {
  title: "O1SF U.S. Market Entry Program — Draft Preview",
  description: "A local draft preview of the O1SF U.S. Market Entry Program and AI Guide.",
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
    },
  },
};

export default function ProgramLayout({ children }) {
  return (
    <div className="program-site">
      <a className="program-skip-link" href="#program-main">Skip to program content</a>
      <ProgramHeader />
      <main id="program-main">{children}</main>
      <ProgramFooter />
    </div>
  );
}
