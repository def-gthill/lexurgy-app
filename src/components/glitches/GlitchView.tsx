import Glitch from "@/models/Glitch";
import Language from "@/models/Language";
import { GlitchResolver } from "@/useGlitchResolver";
import TranslationMissingLexemeView from "./TranslationMissingLexemeView";

export default function GlitchView({
  language,
  glitch,
  resolver,
}: {
  language: Language;
  glitch: Glitch;
  resolver?: GlitchResolver;
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
        addLexeme={
          resolver
            ? (lexeme) => resolver.addLexeme(glitch.id, lexeme)
            : undefined
        }
        deleteTranslation={
          resolver
            ? (id) => resolver?.deleteTranslation(glitch.id, id)
            : undefined
        }
      />
    );
  } else {
    return <></>;
  }
}
