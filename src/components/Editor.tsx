import EditorPane from "@/components/EditorPane";
import { useState } from "react";

export default function Editor<T>({
  component,
  initialValue,
  onSave,
}: {
  component: (value: T, onChange: (newValue: T) => void) => JSX.Element;
  initialValue: T;
  onSave: (value: T) => void;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <EditorPane>
      {component(value, setValue)}
      <div className="buttons">
        <button onClick={() => onSave(value)}>Save</button>
      </div>
    </EditorPane>
  );
}
