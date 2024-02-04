import EditorPane from "@/components/EditorPane";
import { useState } from "react";

export default function HiddenEditor<T>({
  showButtonLabel,
  component,
  initialValue,
  onSave,
  startsShowing,
  hideLabelWhenOpen,
}: {
  showButtonLabel: string;
  component: (value: T, onChange: (newValue: T) => void) => JSX.Element;
  initialValue: T;
  onSave: (value: T) => void;
  startsShowing?: boolean;
  hideLabelWhenOpen?: boolean;
}) {
  const [showing, setShowing] = useState(startsShowing);
  const [value, setValue] = useState(initialValue);
  return showing ? (
    <EditorPane>
      {!hideLabelWhenOpen && (
        <h4 style={{ marginTop: 0 }}>{showButtonLabel}</h4>
      )}
      {component(value, setValue)}
      <div className="buttons">
        <button
          onClick={() => {
            onSave(value);
            setShowing(false);
            setValue(initialValue);
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            setShowing(false);
          }}
        >
          Cancel
        </button>
      </div>
    </EditorPane>
  ) : (
    <div style={{ margin: "4px 0" }}>
      <button onClick={() => setShowing(true)}>{showButtonLabel}</button>
    </div>
  );
}
