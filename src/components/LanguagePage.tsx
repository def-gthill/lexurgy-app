import Language from "@/models/Language";
import Header from "./Header";
import LanguageHeader, { LanguageLink } from "./LanguageHeader";
import useLanguageInfo from "./useLanguageInfo";

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
      <>
        <LanguageHeader id={language.id} active={activeLink} />
        {content(language)}
      </>
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
