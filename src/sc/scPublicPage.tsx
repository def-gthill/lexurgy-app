import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import { loadLocal, saveLocal } from "@/localStorage";
import Evolution from "@/sc/Evolution";
import styles from "@/sc/scPublicPage.module.css";
import ScRunner from "@/sc/ScRunner";
import { decode } from "js-base64";
import { useRouter } from "next/router";
import { useRef } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "www.lexurgy.com";

export default function ScPublic() {
  const router = useRouter();
  const changes = router.query.changes;
  let soundChanges = typeof changes === "string" ? decode(changes) : "";
  const input = router.query.input;
  let testWords = typeof input === "string" ? decode(input).split("\n") : [""];

  if (!soundChanges && testWords.every((word) => word.trim().length === 0)) {
    soundChanges = loadLocal("soundChanges") ?? "";
    testWords = loadLocal("testWords")?.split("\n") ?? [""];
  }

  function onLeave(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue =
      "You have unsaved changes. Are you sure you want to leave?";
  }

  const onLeaveActive = useRef(false);

  function checkLeaveListener(evolution: Evolution) {
    // If local storage isn't working, fall back to
    // a reminder when navigating away.
    const outOfSync =
      loadLocal("soundChanges") !== evolution.soundChanges ||
      loadLocal("testWords") !== evolution.testWords.join("\n");

    if (outOfSync && !onLeaveActive.current) {
      onLeaveActive.current = true;
      window.addEventListener("beforeunload", onLeave);
    }
    if (!outOfSync && onLeaveActive.current) {
      onLeaveActive.current = false;
      window.removeEventListener("beforeunload", onLeave);
    }
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
              checkLeaveListener(evolution);
            }}
          />
        </main>
      </div>
    </>
  );
}
