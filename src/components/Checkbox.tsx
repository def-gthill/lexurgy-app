import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import styles from "./Checkbox.module.css";

export default function Checkbox({
  id,
  ariaLabel,
  checked,
  onCheckedChange,
}: {
  id: string;
  ariaLabel?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Root
      className={styles.root}
      id={id}
      aria-label={ariaLabel}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <Indicator className={styles.indicator}>
        <CheckIcon />
      </Indicator>
    </Root>
  );
}
