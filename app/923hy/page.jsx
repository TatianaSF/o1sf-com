import { AskDocumentDemo } from "../../components/ask-document/AskDocumentDemo.jsx";

export const metadata = {
  title: "Ask the O1SF Program Document - Interactive Demo",
  description:
    "An interactive demo with prepared local answers about the draft O1SF U.S. Market Entry Program.",
  alternates: {
    canonical: "/923hy",
  },
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

export default function AskProgramDocumentPage() {
  return <AskDocumentDemo />;
}
