import { DependentTranslation } from "@/models/Glitch";

export default function TranslationMissingLexemeView({
  translation,
  missingLexeme,
}: {
  translation: DependentTranslation;
  missingLexeme: string;
}) {
  return (
    <>
      <div>
        The non-existent lexeme {`"${missingLexeme}"`} is used in this
        translation.
      </div>
      <div>{translation.value.romanized}</div>
      <div>{translation.value.translation}</div>
    </>
  );
}
