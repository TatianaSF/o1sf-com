import { PolicyPage } from "../../../components/program/PolicyPage";
import { claimsPolicy } from "../../../lib/program-policies";

export const metadata = { title: "Claims & Promises — O1SF Draft Preview" };

export default function ClaimsPage() {
  return <PolicyPage policy={claimsPolicy} />;
}
