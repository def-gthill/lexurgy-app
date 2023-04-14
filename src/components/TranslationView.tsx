import Translation from "@/models/Translation";
import { Fragment, useState } from "react";

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
      {showingStructure &&
        Object.entries(translation.structure!.children).map(
          ([childName, child]) =>
            "romanized" in child && (
              <Fragment key={childName}>
                <div>{childName}</div>
                <div>{child.romanized}</div>
              </Fragment>
            )
        )}
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
