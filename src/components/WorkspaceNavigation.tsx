import * as Collapsible from "@radix-ui/react-collapsible";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import styles from "@/styles/WorkspaceNavigation.module.css";

export default function WorkspaceNavigation() {
  return (
    <Collapsible.Root className={styles.CollapsibleRoot}>
      <Collapsible.Content>
        <ScrollArea.Root className={styles.ScollAreaRoot}>
          <ScrollArea.Viewport className={styles.ScrollAreaViewport}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>Thingy-thing {i}</div>
            ))}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Collapsible.Content>
      <Collapsible.Trigger>Boo!</Collapsible.Trigger>
    </Collapsible.Root>
  );
}
