import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import ScRunner from "@/sc/ScRunner";
import { decode } from "js-base64";
import { useRouter } from "next/router";

export default function ScPublic({ baseUrl }: { baseUrl: string | null }) {
  let soundChangesFromUrl = "";
  let testWordsFromUrl = [""];
  const router = useRouter();
  if (router.isReady) {
    const changes = router.query.changes;
    const input = router.query.input;

    if (typeof input === "string") {
      testWordsFromUrl = decode(input).split("\n");
    }
    if (typeof changes === "string") {
      soundChangesFromUrl = decode(changes);
    }
  }
  return (
    <>
      <PageInfo
        title="Lexurgy Sound Changer"
        description="A high-powered sound change applier"
      />
      <Header />
      <main>
        <ScRunner
          baseUrl={baseUrl}
          initialSoundChanges={soundChangesFromUrl}
          initialTestWords={testWordsFromUrl}
        />
      </main>
    </>
  );
}
