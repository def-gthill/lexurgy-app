import ConstructionView from "@/components/ConstructionView";
import LanguagePage from "@/components/LanguagePage";
import Construction from "@/models/Construction";
import Language from "@/models/Language";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function SyntaxPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useSWR<Construction[], Error>(
    `/api/constructions?language=${id}`,
    fetcher
  );
  const constructions = data || [];
  const { mutate } = useSWRConfig();
  return (
    <LanguagePage
      activeLink="Syntax"
      content={(language: Language) => (
        <>
          <Head>
            <title>Lexurgy - {language.name} Syntax</title>
            <meta
              name="description"
              content={`"Syntax for ${language.name}, a constructed language"`}
            />
          </Head>
          <main>
            <h1>{language.name} Syntax</h1>
            {constructions.map((construction) => (
              <ConstructionView
                construction={construction}
                key={construction.id}
              />
            ))}
          </main>
        </>
      )}
    />
  );
}
