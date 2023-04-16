import * as Label from "@radix-ui/react-label";

export default function Fields({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "max-content 50%" }}>
      {children}
    </div>
  );
}

export function Field({
  id,
  name,
  value,
  onChange,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (newValue: string) => void;
}) {
  return (
    <>
      <Label.Root htmlFor={id}>{name}</Label.Root>
      <input
        type="text"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      ></input>
    </>
  );
}
