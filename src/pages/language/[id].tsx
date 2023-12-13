import FeatureHider from "@/components/FeatureHider";
import LanguageOverview from "@/language/languageOverviewPage";
import Sc from "@/sc/sc";
import axios from "axios";

export default function LanguageMainPage() {
  return (
    <FeatureHider
      getVisibleChild={async () =>
        (await axios.get("/api/userType")).data.featureAccess === "experimental"
          ? 1
          : 0
      }
    >
      <Sc />
      <LanguageOverview />
    </FeatureHider>
  );
}
