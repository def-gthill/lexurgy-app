import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

export default function Checkbox({
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
      className="CheckboxRoot"
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <Indicator className="CheckboxIndicator">
        <CheckIcon />
      </Indicator>
    </Root>
  );
}
