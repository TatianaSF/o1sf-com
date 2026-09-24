import TatianaAssistant from "../../../components/tatianasf-assistant/TatianaAssistant";

const assistantShareTitle = "Connect with TatianaSF — Start Here";
const assistantShareDescription = "Looking to attend an event, speak, sponsor, partner, or work with TatianaSF? Start with this short guided conversation.";
const assistantShareUrl = "https://o1sf.com/tatianasf/assistant";
const assistantShareImage = "https://o1sf.com/assets/o1sf/tatianasf-assistant-linkedin-preview.jpg";

export const metadata = {
  title: "TatianaSF Assistant | Connect with TatianaSF",
  description: assistantShareDescription,
  alternates: { canonical: assistantShareUrl },
  openGraph: {
    title: assistantShareTitle,
    description: assistantShareDescription,
    url: assistantShareUrl,
    type: "website",
    images: [{ url: assistantShareImage, width: 1276, height: 1280, alt: "TatianaSF Assistant — Connect with TatianaSF" }],
  },
};

export default function TatianaAssistantPage() {
  return <TatianaAssistant />;
}
