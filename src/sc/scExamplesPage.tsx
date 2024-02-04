import Header from "@/components/Header";
import Meta from "@/components/Meta";
import { SavedLanguage } from "@/language/Language";
import LanguageInfoView from "@/language/LanguageInfoView";
import useReadOnlyPersistentCollection from "@/useReadOnlyPersistentCollection";
import { SavedWorld } from "@/world/World";

export default function ScExamples() {
  const worldCollection = useReadOnlyPersistentCollection<SavedWorld>(
    "/api/worlds?isExample=true"
  );

  const content = worldCollection.fold({
    onLoading: () => <div>Loading examples...</div>,
    onError: () => <div>Error loading examples</div>,
    onReady: (worlds) => {
      worlds.sort((a, b) => a.name.localeCompare(b.name));
      return (
        <>
          {worlds.map((world) => (
            <ExampleSection key={world.name} world={world} />
          ))}
        </>
      );
    },
  });

  return (
    <>
      <Meta
        title="Lexurgy Sound Changer Examples"
        description="Examples of Lexurgy sound changes"
      />
      <Header />
      <main>
        <h1>Lexurgy Sound Changer Examples</h1>
        {content}
      </main>
    </>
  );
}

function ExampleSection({ world }: { world: SavedWorld }) {
  const languageCollection = useReadOnlyPersistentCollection<SavedLanguage>(
    `/api/languages?world=${world.id}`
  );
  const languageContent = languageCollection.fold({
    onLoading: () => <div>Loading languages...</div>,
    onError: () => <div>Error loading languages</div>,
    onReady: (languages) => (
      <>
        {languages.map((language) => (
          <LanguageInfoView key={language.id} language={language} />
        ))}
      </>
    ),
  });
  return (
    <>
      <h2>{world.name}</h2>
      {languageContent}
    </>
  );
}
