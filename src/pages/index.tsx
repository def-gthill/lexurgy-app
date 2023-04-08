import Language from "@/models/Language";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data: languages, error } = useSWR<Language[], Error>(
    "/api/languages",
    fetcher
  );
  if (error !== undefined) {
    return <div>Error loading workspace</div>;
  } else if (languages === undefined) {
    return <div>Loading workspace...</div>;
  }
  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <h1>My Workspace</h1>
        <h2>Languages</h2>
        {languages.map((language) => (
          <Link href={`/language/${language.id}`}>{language.name}</Link>
        ))}
      </main>
    </>
  );
}
