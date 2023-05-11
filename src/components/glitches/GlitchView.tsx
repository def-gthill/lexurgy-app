import Glitch from "@/models/Glitch";
import Language from "@/models/Language";
import TranslationMissingLexemeView from "./TranslationMissingLexemeView";

export default function GlitchView({
  language,
  glitch,
}: {
  language: Language;
  glitch: Glitch;
}) {
  if (
    glitch.dependent.type === "Translation" &&
    glitch.referent.type === "Lexeme" &&
    glitch.referent.referenceType === "Undefined"
  ) {
    return (
      <TranslationMissingLexemeView
        language={language}
        translation={glitch.dependent}
        missingLexeme={glitch.referent.searchTerm}
        addLexeme={() => {}}
        deleteTranslation={() => {}}
      />
    );
  } else {
    return <></>;
  }
}
