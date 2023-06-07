import Language from "@/language/Language";
import Glitch from "@/models/Glitch";
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
            ? async (lexeme) => {
                await resolver.addLexeme(lexeme);
                // Re-post the translation to link it up to the new lexeme.
                await resolver.addTranslation(glitch.dependent.value);
                await resolver.deleteGlitch(glitch.id);
              }
            : undefined
        }
        deleteTranslation={
          resolver
            ? async (id) => {
                await resolver.deleteTranslation(id);
                await resolver.deleteGlitch(glitch.id);
              }
            : undefined
        }
      />
    );
  } else {
    return <></>;
  }
}
