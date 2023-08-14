import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Construction from "@/syntax/Construction";
import ConstructionEditor from "@/syntax/ConstructionEditor";
import ConstructionView from "@/syntax/ConstructionView";
import usePersistentCollection from "@/usePersistentCollection";
import useStateResetter from "@/useStateResetter";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SyntaxPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const [resetterKey, reset] = useStateResetter();
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
              key={resetterKey}
              showButtonLabel="Add Construction"
              component={(value, onChange) => (
                <ConstructionEditor construction={value} onChange={onChange} />
              )}
              initialValue={{
                languageId: language.id,
                name: "",
                children: [""],
              }}
              onSave={(value: Construction) => {
                constructionCollection.save(value);
                reset();
              }}
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
