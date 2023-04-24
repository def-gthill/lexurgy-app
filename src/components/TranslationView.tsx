import Construction from "@/models/Construction";
import Translation from "@/models/Translation";
import { useState } from "react";
import Editor from "./Editor";
import SyntaxTreeView from "./SyntaxTreeView";
import TranslationEditor from "./TranslationEditor";

export default function TranslationView({
  constructions,
  translation,
  onUpdate,
}: {
  constructions?: Construction[];
  translation: Translation;
  onUpdate?: (newTranslation: Translation) => void;
}) {
  const [showingStructure, setShowingStructure] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedTranslation, setEditedTranslation] = useState(translation);
  const content = (
    <>
      <p>
        <i>{editedTranslation.romanized}</i>
      </p>
      {editedTranslation.structure &&
        (showingStructure ? (
          <button onClick={() => setShowingStructure(false)}>
            Hide Structure
          </button>
        ) : (
          <button onClick={() => setShowingStructure(true)}>
            Show Structure
          </button>
        ))}
      {showingStructure && (
        <SyntaxTreeView root={editedTranslation.structure!} />
      )}
      <p>{`"${editedTranslation.translation}"`}</p>
    </>
  );
  if (onUpdate) {
    return editing ? (
      <Editor
        component={(value, onChange) => (
          <TranslationEditor
            constructions={constructions}
            translation={value}
            onChange={onChange}
          />
        )}
        initialValue={editedTranslation}
        onSave={(value) => {
          setEditing(false);
          setEditedTranslation(value);
          onUpdate({ ...value, id: translation.id });
        }}
      />
    ) : (
      <li className="card" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexGrow: 1 }}>{content}</div>
        <div className="buttons">
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      </li>
    );
  }
  return <div className="card">{content}</div>;
}
