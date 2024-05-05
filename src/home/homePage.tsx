import FeatureHider from "@/components/FeatureHider";
import Header from "@/components/Header";
import HiddenEditor from "@/components/HiddenEditor";
import Language, { SavedLanguage } from "@/language/Language";
import LanguageList from "@/language/LanguageList";
import usePersistentCollection from "@/usePersistentCollection";
import World, { SavedWorld, emptyWorld } from "@/world/World";
import WorldInfoEditor from "@/world/WorldInfoEditor";
import WorldInfoView from "@/world/WorldInfoView";
import axios from "axios";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
      </Head>
      <Header />
      <main>
        <FeatureHider
          getVisibleChild={() =>
            Promise.resolve(session.data?.user?.email ? 1 : 0)
          }
        >
          <>
            <h2>Tools</h2>
            <div className="card">
              <Link href="/sc">Sound Changer</Link>
            </div>
          </>
          <Workspace />
        </FeatureHider>
      </main>
    </>
  );
}

function Workspace() {
  const worldCollection = usePersistentCollection<World, SavedWorld>(
    "/api/worlds"
  );
  const languageCollection = usePersistentCollection<Language, SavedLanguage>(
    "/api/languages",
    "/api/languages?world=none"
  );

  const worldContent = worldCollection.fold({
    onLoading: () => <div>Loading worlds...</div>,
    onError: () => <div>Error loading worlds</div>,
    onReady: (worlds) => {
      worlds.sort((a, b) => a.name.localeCompare(b.name));
      return (
        <>
          <h2>Worlds</h2>
          <HiddenEditor
            showButtonLabel="New World"
            component={(value, onChange) => (
              <WorldInfoEditor world={value} onChange={onChange} />
            )}
            initialValue={emptyWorld()}
            onSave={(value) => worldCollection.save(value)}
          />
          {worlds.map((world) => (
            <FeatureHider
              key={world.id}
              getVisibleChild={async () => {
                const userType = (await axios.get("/api/userType")).data;
                return userType.hasAdminAccess ? 1 : 0;
              }}
            >
              <WorldInfoView world={world} onUpdate={worldCollection.save} />
              <WorldInfoView
                world={world}
                onUpdate={worldCollection.save}
                exampleSwitchEnabled
              />
            </FeatureHider>
          ))}
        </>
      );
    },
  });

  const languageContent = languageCollection.fold({
    onLoading: () => <div>Loading languages...</div>,
    onError: () => <div>Error loading languages</div>,
    onReady: (languages) => {
      languages.sort((a, b) => a.name.localeCompare(b.name));
      return (
        <LanguageList
          languages={languages}
          worlds={worldCollection.getOrEmpty()}
          onSave={languageCollection.save}
          onDelete={languageCollection.delete}
        />
      );
    },
  });

  return (
    <>
      <h1>My Workspace</h1>
      {worldContent}
      {languageContent}
    </>
  );
}
