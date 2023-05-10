import Glitch from "@/models/Glitch";
import TranslationMissingLexemeView from "./TranslationMissingLexemeView";

export default function GlitchView({ glitch }: { glitch: Glitch }) {
  if (
    glitch.dependent.type === "Translation" &&
    glitch.referent.type === "Lexeme" &&
    glitch.referent.referenceType === "Undefined"
  ) {
    return (
      <TranslationMissingLexemeView
        translation={glitch.dependent}
        missingLexeme={glitch.referent.searchTerm}
      />
    );
  } else {
    return <></>;
  }
}
