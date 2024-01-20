import Header from "@/components/Header";
import Language, { SavedLanguage } from "@/language/Language";
import LanguageList from "@/language/LanguageList";
import usePersistentCollection from "@/usePersistentCollection";
import waitForId from "@/waitForId";
import { SavedWorld } from "@/world/World";
import axios from "axios";
import Head from "next/head";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default waitForId(WorldOverview);

function WorldOverview({ id }: { id: string }) {
  const { data: world, error } = useSWR<SavedWorld, Error>(
    `/api/worlds/${id}`,
    fetcher
  );
  const languageCollection = usePersistentCollection<Language, SavedLanguage>(
    "/api/languages",
    `/api/languages?world=${id}`
  );

  if (world !== undefined) {
    return (
      <>
        <Head>
          <title>Lexurgy - {world.name}</title>
          <meta
            name="description"
            content={`"${world.name}, a constructed world"`}
          />
        </Head>
        <Header />
        <main>
          <h1>{world.name}</h1>
          <p>{world.description}</p>
          <LanguageList
            languages={languageCollection.getOrEmpty()}
            onSave={(newLanguage) =>
              languageCollection.save({ ...newLanguage, worldId: id })
            }
            onDelete={languageCollection.delete}
          />
        </main>
      </>
    );
  } else if (error !== undefined) {
    return (
      <>
        <Header />
        <main>
          <div>World not found</div>
        </main>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <main>
          <div>Loading world...</div>
        </main>
      </>
    );
  }
}
