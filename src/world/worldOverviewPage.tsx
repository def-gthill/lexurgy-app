import Header from "@/components/Header";
import { SavedWorld } from "@/world/World";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function WorldOverview() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: world, error } = useSWR<SavedWorld, Error>(
    router.isReady ? `/api/worlds/${id}` : null,
    fetcher
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
