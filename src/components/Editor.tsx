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
    <>
      {component(value, setValue)}
      <div>
        <button onClick={() => onSave(value)}>Save</button>
      </div>
    </>
  );
}
