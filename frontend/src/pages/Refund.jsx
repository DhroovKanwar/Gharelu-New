import LegalPage from "../components/common/LegalPage";
import { policies } from "../data/content";

export default function Refund() {
  return (
    <LegalPage
      policy={policies.refund}
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Refund & Cancellation" }]}
    />
  );
}
