import Buttons from "@/components/Buttons";
import EditorPane from "@/components/EditorPane";
import * as Schema from "@/components/Schema";
import SchematicEditor from "@/components/SchematicEditor";
import World from "@/world/World";
import { useState } from "react";

export default function WorldInfoEditor({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue: World;
  onSave: (newValue: World) => void;
  onCancel: () => void;
}) {
  const [editedValue, setEditedValue] = useState(initialValue);
  return (
    <EditorPane>
      <SchematicEditor
        schema={Schema.object("World", {
          name: Schema.string("Name"),
          description: Schema.string("Description"),
        })}
        value={editedValue}
        onChange={setEditedValue}
      />
      <Buttons
        buttons={[
          { label: "Save", onClick: () => onSave(editedValue) },
          { label: "Cancel", onClick: onCancel },
        ]}
      />
    </EditorPane>
  );
}
