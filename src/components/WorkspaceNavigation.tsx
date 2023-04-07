import Language from "@/models/Language";
import styles from "@/styles/WorkspaceNavigation.module.css";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WorkspaceNavigation() {
  const { data, error } = useSWR<Language[], Error>("/api/language", fetcher);
  let workspaceItems;
  if (data !== undefined) {
    workspaceItems = data.map((language) => language.name);
  } else if (error !== undefined) {
    workspaceItems = ["Error!"];
    console.log(error);
  } else {
    workspaceItems = ["Loading..."];
  }
  return (
    <Collapsible.Root className={styles.CollapsibleRoot}>
      <Collapsible.Content>
        <ScrollArea.Root className={styles.ScollAreaRoot}>
          <ScrollArea.Viewport className={styles.ScrollAreaViewport}>
            {workspaceItems.map((item, i) => (
              <div key={i}>{item}</div>
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
