import "./program.css";

import { ProgramChrome } from "../../components/program/ProgramChrome";

export const metadata = {
  title: "O1SF U.S. Market Entry Program - Draft Preview",
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
  return <ProgramChrome>{children}</ProgramChrome>;
}
