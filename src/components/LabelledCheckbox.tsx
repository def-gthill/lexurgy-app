import Checkbox from "@/components/Checkbox";
import * as Label from "@radix-ui/react-label";

export default function LabelledCheckbox({
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
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label.Root htmlFor={id}>{label}</Label.Root>
    </div>
  );
}
