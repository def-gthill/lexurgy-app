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
    <>
      {component(value, setValue)}
      <div>
        <button
          onClick={() => {
            onSave(value);
            setShowing(false);
          }}
        >
          Save
        </button>
      </div>
    </>
  ) : (
    <button onClick={() => setShowing(true)}>{showButtonLabel}</button>
  );
}
