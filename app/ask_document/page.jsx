import { AskDocumentChatDemo } from "../../components/ask-document/AskDocumentChatDemo.jsx";

export const metadata = {
  title: "Ask the O1SF Program Document - Interactive Demo",
  description:
    "Explore prepared answers from the draft O1SF U.S. Market Entry Program knowledge base.",
  alternates: {
    canonical: "/ask_document/",
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

export default function AskDocumentPage() {
  return <AskDocumentChatDemo />;
}
