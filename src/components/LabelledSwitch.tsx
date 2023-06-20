import * as Label from "@radix-ui/react-label";
import Switch from "./Switch";

export default function LabelledSwitch({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label.Root htmlFor={id}>{label}</Label.Root>
    </div>
  );
}
