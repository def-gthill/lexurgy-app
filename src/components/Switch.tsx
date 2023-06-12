import { Root, Thumb } from "@radix-ui/react-switch";
import styles from "./Switch.module.css";

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
      className={styles.root}
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <Thumb className={styles.thumb} />
    </Root>
  );
}
