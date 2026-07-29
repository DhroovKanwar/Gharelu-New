import LegalPage from "../components/common/LegalPage";
import { policies } from "../data/content";

export default function Privacy() {
  return (
    <LegalPage
      policy={policies.privacy}
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]}
    />
  );
}
