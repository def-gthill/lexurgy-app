import FeatureHider from "@/components/FeatureHider";
import Header from "@/components/Header";
import Glitch from "@/glitch/Glitch";
import { SavedLanguage } from "@/language/Language";
import useReadOnlyPersistentCollection from "@/useReadOnlyPersistentCollection";
import axios from "axios";
import useLanguageInfo from "../language/useLanguageInfo";
import LanguageHeader, { LanguageLink } from "./LanguageHeader";

export default function LanguagePage({
  content,
  activeLink,
}: {
  content: (language: SavedLanguage) => JSX.Element;
  activeLink: LanguageLink;
}) {
  const { language, error } = useLanguageInfo();

  if (language !== undefined) {
    return (
      <FeatureHider
        getVisibleChild={async () =>
          (await axios.get("/api/userType")).data.featureAccess ===
          "experimental"
            ? 1
            : 0
        }
      >
        <LanguagePageWithGlitches
          language={language}
          content={content}
          activeLink={activeLink}
          showLinks={false}
        />
        <LanguagePageWithGlitches
          language={language}
          content={content}
          activeLink={activeLink}
        />
      </FeatureHider>
    );
  } else if (error !== undefined) {
    return (
      <>
        <Header />
        <main>
          <div>Language not found</div>
        </main>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <main>
          <div>Loading language...</div>
        </main>
      </>
    );
  }
}

function LanguagePageWithGlitches({
  language,
  content,
  activeLink,
  showLinks = true,
}: {
  language: SavedLanguage;
  content: (language: SavedLanguage) => JSX.Element;
  activeLink: LanguageLink;
  showLinks?: boolean;
}) {
  const glitchCollection = useReadOnlyPersistentCollection<Glitch>(
    `/api/glitches?language=${language.id}`
  );
  const glitchCount = glitchCollection.getOrEmpty().length;
  return (
    <>
      {showLinks && (
        <LanguageHeader
          id={language.id}
          active={activeLink}
          glitchCount={glitchCount}
        />
      )}
      {content(language)}
    </>
  );
}
