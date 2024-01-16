import { useState } from "react";

export default function CreateButton<T>({
  label,
  component,
  onSave,
}: {
  label?: string;
  component: (
    onSave: (newValue: T) => void,
    onCancel: () => void
  ) => JSX.Element;
  onSave: (newValue: T) => void;
}) {
  const [showing, setShowing] = useState(false);
  return showing ? (
    component(
      (value) => {
        setShowing(false);
        onSave(value);
      },
      () => {
        setShowing(false);
      }
    )
  ) : (
    <div style={{ margin: "4px 0" }}>
      <button onClick={() => setShowing(true)}>{label}</button>
    </div>
  );
}
