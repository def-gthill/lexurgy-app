import {
  Corner,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
} from "@radix-ui/react-scroll-area";
import styles from "./ScrollArea.module.css";

export default function ScrollArea({ children }: { children: JSX.Element }) {
  return (
    <Root className={styles.root}>
      <Viewport className={styles.viewport}>{children}</Viewport>
      <Scrollbar orientation="horizontal" className={styles.scrollbar}>
        <Thumb className={styles.thumb} />
      </Scrollbar>
      <Scrollbar orientation="vertical" className={styles.scrollbar}>
        <Thumb className={styles.thumb} />
      </Scrollbar>
      <Corner className={styles.corner} />
    </Root>
  );
}
