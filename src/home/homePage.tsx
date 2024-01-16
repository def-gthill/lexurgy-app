import CreateButton from "@/components/CreateButton";
import Header from "@/components/Header";
import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguageInfoEditor from "@/language/LanguageInfoEditor";
import LanguageInfoView from "@/language/LanguageInfoView";
import usePersistentCollection from "@/usePersistentCollection";
import { emptyWorld } from "@/world/World";
import WorldInfoEditor from "@/world/WorldInfoEditor";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [worldEditorToggle, setWorldEditorToggle] = useState(false);
  const [editorToggle, setEditorToggle] = useState(false);
  const languageCollection = usePersistentCollection<Language, Language>(
    "/api/languages"
  );

  const content = languageCollection.fold({
    onLoading: () => <div>Loading workspace...</div>,
    onError: () => <div>Error loading workspace</div>,
    onReady: (languages) => {
      languages.sort((a: Language, b: Language) =>
        a.name.localeCompare(b.name)
      );
      return (
        <>
          <h1>My Workspace</h1>
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
            onSave={() => {}}
          />
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
      <main>{content}</main>
    </>
  );
}
