import { PolicyPage } from "../../../components/program/PolicyPage";
import { participantRequirements } from "../../../lib/program-policies";

export const metadata = { title: "Participant Requirements — O1SF Draft Preview" };

export default function RequirementsPage() {
  return <PolicyPage policy={participantRequirements} />;
}
