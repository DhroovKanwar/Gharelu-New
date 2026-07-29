import LegalPage from "../components/common/LegalPage";
import { policies } from "../data/content";

export default function Terms() {
  return (
    <LegalPage
      policy={policies.terms}
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Terms & Conditions" }]}
    />
  );
}
