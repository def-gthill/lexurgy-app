import Header from "@/components/Header";
import Glitch from "@/glitch/Glitch";
import Language from "@/language/Language";
import { Saved } from "@/models/Saved";
import useReadOnlyPersistentCollection from "@/useReadOnlyPersistentCollection";
import useLanguageInfo from "../language/useLanguageInfo";
import LanguageHeader, { LanguageLink } from "./LanguageHeader";

export default function LanguagePage({
  content,
  activeLink,
}: {
  content: (language: Language) => JSX.Element;
  activeLink: LanguageLink;
}) {
  const { language, error } = useLanguageInfo();
  if (language !== undefined && language.id !== undefined) {
    return (
      <LanguagePageWithGlitches
        language={language as Saved<Language>}
        content={content}
        activeLink={activeLink}
      />
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
}: {
  language: Saved<Language>;
  content: (language: Language) => JSX.Element;
  activeLink: LanguageLink;
}) {
  const glitchCollection = useReadOnlyPersistentCollection<Glitch>(
    `/api/glitches?language=${language.id}`
  );
  const glitchCount = glitchCollection.getOrEmpty().length;
  return (
    <>
      <LanguageHeader
        id={language.id}
        active={activeLink}
        glitchCount={glitchCount}
      />
      {content(language)}
    </>
  );
}
