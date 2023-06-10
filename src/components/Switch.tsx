import { Root, Thumb } from "@radix-ui/react-switch";

export default function Switch({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Root
      className="SwitchRoot"
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <Thumb className="SwitchThumb" />
    </Root>
  );
}
