import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import ScRunner from "@/sc/ScRunner";
import { decode } from "js-base64";
import { useRouter } from "next/router";

const baseUrl = "www.lexurgy.com";

export default function ScPublic() {
  const router = useRouter();
  const changes = router.query.changes;
  const soundChangesFromUrl =
    typeof changes === "string" ? decode(changes) : "";
  const input = router.query.input;
  const testWordsFromUrl =
    typeof input === "string" ? decode(input).split("\n") : [""];
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
          evolution={{
            soundChanges: soundChangesFromUrl,
            testWords: testWordsFromUrl,
          }}
        />
      </main>
    </>
  );
}
