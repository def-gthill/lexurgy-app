import Editor from "@/components/Editor";
import Construction from "@/syntax/Construction";
import SyntaxTreeView from "@/translation/SyntaxTreeView";
import Translation from "@/translation/Translation";
import TranslationEditor from "@/translation/TranslationEditor";
import { useState } from "react";

export default function TranslationView({
  constructions,
  translation,
  onUpdate,
  onDelete,
}: {
  constructions?: Construction[];
  translation: Translation;
  onUpdate?: (newTranslation: Translation) => void;
  onDelete?: (id: string) => void;
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
  if (onUpdate && editing) {
    return (
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
    );
  } else {
    return (
      <li className="card" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexGrow: 1 }}>{content}</div>
        <div className="buttons">
          {onUpdate && <button onClick={() => setEditing(true)}>Edit</button>}
          {onDelete && (
            <button
              className="danger"
              onClick={() => onDelete(translation.id!)}
            >
              Delete
            </button>
          )}
        </div>
      </li>
    );
  }
}
