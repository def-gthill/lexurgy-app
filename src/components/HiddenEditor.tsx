import { useState } from "react";

export default function HiddenEditor<T>({
  showButtonLabel,
  component,
  initialValue,
  onSave,
  startsShowing,
}: {
  showButtonLabel: string;
  component: (value: T, onChange: (newValue: T) => void) => JSX.Element;
  initialValue: T;
  onSave: (value: T) => void;
  startsShowing?: boolean;
}) {
  const [showing, setShowing] = useState(startsShowing);
  const [value, setValue] = useState(initialValue);
  return showing ? (
    <div className="editor">
      <h4 style={{ marginTop: 0 }}>{showButtonLabel}</h4>
      {component(value, setValue)}
      <div className="buttons">
        <button
          onClick={() => {
            onSave(value);
            setShowing(false);
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
    </div>
  ) : (
    <div style={{ margin: "4px 0" }}>
      <button onClick={() => setShowing(true)}>{showButtonLabel}</button>
    </div>
  );
}
