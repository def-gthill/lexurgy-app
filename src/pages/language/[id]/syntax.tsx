import ConstructionEditor from "@/components/ConstructionEditor";
import ConstructionView from "@/components/ConstructionView";
import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Construction from "@/models/Construction";
import usePersistentCollection from "@/usePersistentCollection";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SyntaxPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const constructionCollection = usePersistentCollection<Construction>(
    "/api/constructions",
    `/api/constructions?language=${id}`
  );
  const constructions = constructionCollection.getOrEmpty();

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
            <HiddenEditor
              showButtonLabel="Add Construction"
              component={(value, onChange) => (
                <ConstructionEditor construction={value} onChange={onChange} />
              )}
              initialValue={{
                languageId: language.id,
                name: "",
                children: [""],
              }}
              onSave={constructionCollection.save}
            />
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
