import Header from "@/components/Header";
import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguageInfoEditor from "@/language/LanguageInfoEditor";
import LanguageInfoView from "@/language/LanguageInfoView";
import usePersistentCollection from "@/usePersistentCollection";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [editorToggle, setEditorToggle] = useState(false);
  const languageCollection =
    usePersistentCollection<Language>("/api/languages");

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

  function DeleteLanguageConfirmDialog({ language }: { language: Language }) {
    const [confirmText, setConfirmText] = useState("");
    return (
      <div className="buttons">
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="danger">Delete</button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="AlertDialogOverlay" />
            <AlertDialog.Content className="AlertDialogContent">
              <AlertDialog.Title className="AlertDialogTitle">
                Are you absolutely sure?
              </AlertDialog.Title>
              <AlertDialog.Description className="AlertDialogDescription">
                <p>
                  This will permanently delete {language.name} and all its data.
                  This cannot be undone.
                </p>
                <Label.Root htmlFor="confirm">
                  Type the name of the language:
                </Label.Root>
                <input
                  type="text"
                  id="confirm"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                />
              </AlertDialog.Description>
              <div className="buttons">
                <AlertDialog.Cancel asChild>
                  <button>Cancel</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    className="danger"
                    disabled={
                      confirmText.toLocaleLowerCase() !==
                      language.name.toLocaleLowerCase()
                    }
                    onClick={() => languageCollection.delete(language.id!)}
                  >
                    Delete
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    );
  }
}
