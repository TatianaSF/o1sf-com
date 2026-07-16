import { PolicyPage } from "../../../components/program/PolicyPage";
import { privacySecurityPolicy } from "../../../lib/program-policies";

export const metadata = { title: "Privacy & Security — O1SF Draft Preview" };

export default function PrivacySecurityPage() {
  return <PolicyPage policy={privacySecurityPolicy} />;
}
