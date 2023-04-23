import Header from "@/components/Header";
import HiddenEditor from "@/components/HiddenEditor";
import LanguageInfoEditor from "@/components/LanguageInfoEditor";
import Language from "@/models/Language";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data: languages, error } = useSWR<Language[], Error>(
    "/api/languages",
    fetcher
  );
  const { mutate } = useSWRConfig();
  if (error !== undefined) {
    return (
      <>
        <Header />
        <main>
          <div>Error loading workspace</div>
        </main>
      </>
    );
  } else if (languages === undefined) {
    return (
      <>
        <Header />
        <main>
          <div>Loading workspace...</div>
        </main>
      </>
    );
  }
  languages.sort((a: Language, b: Language) => a.name.localeCompare(b.name));
  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
      </Head>
      <Header />
      <main>
        <h1>My Workspace</h1>
        <h2>Languages</h2>
        <HiddenEditor
          showButtonLabel="New Language"
          component={(value, onChange) => (
            <LanguageInfoEditor language={value} onChange={onChange} />
          )}
          initialValue={{ name: "" }}
          onSave={saveLanguage}
        />
        {languages.map((language) => (
          <div
            className="card"
            key={language.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Link href={`/language/${language.id}`} style={{ flexGrow: 1 }}>
              {language.name}
            </Link>
            <DeleteLanguageConfirmDialog language={language} />
          </div>
        ))}
      </main>
    </>
  );

  async function saveLanguage(language: Language) {
    await axios.post("/api/languages", language);
    mutate(`/api/languages`);
  }
}

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
