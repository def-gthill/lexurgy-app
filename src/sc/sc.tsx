import { SavedLanguage } from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import { addId } from "@/object";
import Evolution, { SavedEvolution } from "@/sc/Evolution";
import ScRunner from "@/sc/ScRunner";
import styles from "@/sc/sc.module.css";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "www.lexurgy.com";

export default function Sc() {
  const router = useRouter();
  const id = router.query.id;

  const [error, setError] = useState("");
  const [evolution, setEvolution] = useState<SavedEvolution | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      axios
        .get(`/api/evolutions?language=${id}`)
        .then((res) => {
          const evolutions = res.data as SavedEvolution[];
          const evolution =
            evolutions[0] ||
            addId<Evolution>({
              soundChanges: "",
              testWords: [""],
            });
          setEvolution((existingEvolution) => existingEvolution || evolution);
        })
        .catch(() => setError("Sound changes not found"));
    }
  }, [id]);

  return (
    <div className={styles.page}>
      <LanguagePage
        activeLink="Evolution"
        content={(language: SavedLanguage) => {
          if (error) {
            return <div>Evolution not found</div>;
          } else if (evolution) {
            return (
              <>
                <Head>
                  <title>Lexurgy - {language.name} Evolution</title>
                  <meta
                    name="description"
                    content={`"Evolution of ${language.name}, a constructed language"`}
                  />
                </Head>
                <main>
                  <h1>{language.name} Evolution</h1>
                  <div className={styles.runnerContainer}>
                    <ScRunner
                      baseUrl={baseUrl}
                      evolution={evolution}
                      onUpdate={(newEvolution) =>
                        axios.post("/api/evolutions", {
                          id: evolution.id,
                          languageId: language.id,
                          ...newEvolution,
                        })
                      }
                    />
                  </div>
                </main>
              </>
            );
          } else {
            return <div>Loading evolution...</div>;
          }
        }}
      />
    </div>
  );
}
