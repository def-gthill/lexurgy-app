import CreateButton from "@/components/CreateButton";
import Header from "@/components/Header";
import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguageInfoEditor from "@/language/LanguageInfoEditor";
import LanguageInfoView from "@/language/LanguageInfoView";
import usePersistentCollection from "@/usePersistentCollection";
import World, { SavedWorld, emptyWorld } from "@/world/World";
import WorldInfoEditor from "@/world/WorldInfoEditor";
import WorldInfoView from "@/world/WorldInfoView";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [editorToggle, setEditorToggle] = useState(false);
  const worldCollection = usePersistentCollection<World, SavedWorld>(
    "/api/worlds"
  );
  const languageCollection = usePersistentCollection<Language, Language>(
    "/api/languages"
  );

  const worldContent = worldCollection.fold({
    onLoading: () => <div>Loading worlds...</div>,
    onError: () => <div>Error loading worlds</div>,
    onReady: (worlds) => {
      worlds.sort((a: Language, b: Language) => a.name.localeCompare(b.name));
      return (
        <>
          <h2>Worlds</h2>
          <CreateButton
            label="New World"
            component={(onSave, onCancel) => (
              <WorldInfoEditor
                initialValue={emptyWorld()}
                onSave={onSave}
                onCancel={onCancel}
              />
            )}
            onSave={(value: World) => worldCollection.save(value)}
          />
          {worlds.map((world) => (
            <WorldInfoView key={world.id} world={world} />
          ))}
        </>
      );
    },
  });

  const languageContent = languageCollection.fold({
    onLoading: () => <div>Loading languages...</div>,
    onError: () => <div>Error loading languages</div>,
    onReady: (languages) => {
      languages.sort((a: Language, b: Language) =>
        a.name.localeCompare(b.name)
      );
      return (
        <>
          <h2>Languages</h2>
          <HiddenEditor
            key={editorToggle.toString()}
            showButtonLabel="New Language"
            component={(value, onChange) => (
              <LanguageInfoEditor language={value} onChange={onChange} />
            )}
            initialValue={{ name: "" }}
            onSave={(value) => {
              languageCollection.save(value);
              setEditorToggle(!editorToggle);
            }}
          />
          {languages.map((language) => (
            <LanguageInfoView
              key={language.id}
              language={language}
              onUpdate={languageCollection.save}
              onDelete={languageCollection.delete}
            />
          ))}
        </>
      );
    },
  });

  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
      </Head>
      <Header />
      <main>
        <h1>My Workspace</h1>
        {worldContent}
        {languageContent}
      </main>
    </>
  );
}
