import Fields, { Field } from "@/components/Fields";
import Construction from "@/syntax/Construction";
import { structureToRomanized } from "@/translation/SyntaxNode";
import SyntaxTreeEditor from "@/translation/SyntaxTreeEditor";
import SyntaxTreeView from "@/translation/SyntaxTreeView";
import Translation from "@/translation/Translation";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";

export default function TranslationEditor({
  constructions,
  translation,
  onChange,
}: {
  constructions?: Construction[];
  translation: Translation;
  onChange: (newTranslation: Translation) => void;
}) {
  const [editing, setEditing] = useState(!translation.structure);
  const syntaxTreeEditor =
    constructions && constructions.length > 0 ? (
      <div>
        <SyntaxTreeEditor
          constructions={constructions}
          root={translation.structure}
          saveTree={(structure) => {
            setEditing(false);
            onChange({
              ...translation,
              romanized: structureToRomanized(structure),
              structure: structure,
            });
          }}
        />
      </div>
    ) : (
      <div>No Constructions</div>
    );
  return (
    <>
      <Fields>
        <Label.Root htmlFor="structure">Structure</Label.Root>
        {editing ? (
          syntaxTreeEditor
        ) : (
          <div>
            <SyntaxTreeView root={translation.structure || { children: [] }} />
            <button onClick={() => setEditing(true)}>Edit</button>
          </div>
        )}
        <Field
          id="translation"
          name="Free Translation"
          value={translation.translation}
          onChange={(value) => onChange({ ...translation, translation: value })}
        />
      </Fields>
    </>
  );
}
