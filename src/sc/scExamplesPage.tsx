import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import Evolution, { emptyEvolution } from "@/sc/Evolution";
import ScExampleWorld from "@/sc/ScExampleWorld";
import ScRunner from "@/sc/ScRunner";
import styles from "@/sc/scExamplesPage.module.css";
import useReadOnlyPersistentCollection from "@/useReadOnlyPersistentCollection";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import {
  ForwardedRef,
  Fragment,
  ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";

const baseUrl = "www.lexurgy.com";

export default function ScExamples() {
  const [evolution, setEvolution] = useState(emptyEvolution());
  const worldCollection = useReadOnlyPersistentCollection<ScExampleWorld>(
    "/api/scExampleWorlds"
  );

  const worldDropdown = worldCollection.fold({
    onLoading: () => <div>Loading examples...</div>,
    onError: () => <div>Error loading examples</div>,
    onReady: (worlds) => {
      if (worlds.length === 0 || worlds[0].languages.length === 0) {
        return <div>No examples found</div>;
      }
      worlds.sort((a, b) => a.name.localeCompare(b.name));
      for (const world of worlds) {
        world.languages.sort((a, b) => a.name.localeCompare(b.name));
      }
      return <ExampleSelect worlds={worlds} onSelect={setEvolution} />;
    },
  });

  return (
    <>
      <PageInfo
        title="Lexurgy Sound Changer Examples"
        description="Examples of Lexurgy sound changes"
      />
      <Header />
      <main>
        <h1>Sound Changer Examples</h1>
        {worldDropdown}
        <ScRunner baseUrl={baseUrl} evolution={evolution} />
      </main>
    </>
  );
}

function ExampleSelect({
  worlds,
  onSelect,
}: {
  worlds: ScExampleWorld[];
  onSelect: (evolution: Evolution) => void;
}) {
  const defaultValue = worlds[0].languages[0].id;
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(
    null
  );
  const evolutionsByLanguageId: Record<string, Evolution> = {};
  for (const world of worlds) {
    for (const language of world.languages) {
      evolutionsByLanguageId[language.id] = language.evolution;
    }
  }
  useEffect(() => {
    if (selectedLanguageId === null) {
      onSelect(evolutionsByLanguageId[defaultValue]);
    }
  });
  return (
    <div>
      <Label.Root htmlFor="chooseExample">Choose Example</Label.Root>
      <Select.Root
        defaultValue={defaultValue}
        value={selectedLanguageId ?? defaultValue}
        onValueChange={(languageId) => {
          setSelectedLanguageId(languageId);
          onSelect(evolutionsByLanguageId[languageId]);
        }}
      >
        <Select.Trigger
          id="chooseExample"
          className={styles.SelectTrigger}
          aria-label="Examples"
        >
          <Select.Value />
          <Select.Icon className={styles.SelectIcon}>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={styles.SelectContent}>
            <Select.ScrollUpButton className={styles.SelectScrollButton}>
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className={styles.SelectViewport}>
              {worlds.map((world, i) => (
                <Fragment key={world.id}>
                  {i > 0 && (
                    <Select.Separator className={styles.SelectSeparator} />
                  )}
                  <Select.Group>
                    <Select.Label className={styles.SelectLabel}>
                      {world.name}
                    </Select.Label>
                    {world.languages.map((language) => (
                      <SelectItem key={language.id} value={language.id}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </Select.Group>
                </Fragment>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className={styles.SelectScrollButton}>
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

const SelectItem = forwardRef(function SelectItem(
  { children, ...props }: Select.SelectItemProps & { children: ReactNode },
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  return (
    <Select.Item className={styles.SelectItem} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles.SelectItemIndicator}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});
