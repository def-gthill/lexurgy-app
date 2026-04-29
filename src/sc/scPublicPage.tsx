import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import ScRunner from "@/sc/ScRunner";
import styles from "@/sc/scPublicPage.module.css";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { loadLocal, saveLocal } from "@/localStorage";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "www.lexurgy.com";

export default function ScPublic() {
  const router = useRouter();
  const changes = router.query.changes;
  let soundChanges = typeof changes === "string" ? decode(changes) : "";
  const input = router.query.input;
  let testWords = typeof input === "string" ? decode(input).split("\n") : [""];

  console.log("Sound changes from URL", soundChanges);
  console.log("Test words from URL", testWords);
  if (!soundChanges && testWords.every((word) => word.trim().length === 0)) {
    console.log("Loading from local storage!");
    soundChanges = loadLocal("soundChanges") ?? "";
    testWords = loadLocal("testWords")?.split("\n") ?? [""];
  }

  return (
    <>
      <PageInfo
        title="Lexurgy Sound Changer"
        description="A high-powered sound change applier"
      />
      <div className={styles.page}>
        <Header />
        <main>
          <ScRunner
            baseUrl={baseUrl}
            evolution={{
              soundChanges,
              testWords,
            }}
            onUpdate={(evolution) => {
              saveLocal("soundChanges", evolution.soundChanges);
              saveLocal("testWords", evolution.testWords.join("\n"));
            }}
          />
        </main>
      </div>
    </>
  );
}
