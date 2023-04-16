import Translation from "@/models/Translation";
import { useState } from "react";
import SyntaxTreeView from "./SyntaxTreeView";

export default function TranslationView({
  translation,
}: {
  translation: Translation;
}) {
  const [showingStructure, setShowingStructure] = useState(false);
  return (
    <>
      <p>
        <i>{translation.romanized}</i>
      </p>
      {showingStructure && <SyntaxTreeView root={translation.structure!} />}
      <p>{`"${translation.translation}"`}</p>
      {translation.structure &&
        (showingStructure ? (
          <button onClick={() => setShowingStructure(false)}>
            Hide Structure
          </button>
        ) : (
          <button onClick={() => setShowingStructure(true)}>
            Show Structure
          </button>
        ))}
    </>
  );
}
