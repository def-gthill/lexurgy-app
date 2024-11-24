import FeatureHider from "@/components/FeatureHider";
import Header from "@/components/Header";
import { Workspace } from "@/home/Workspace";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
      </Head>
      <Header />
      <main>
        <FeatureHider
          getVisibleChild={() =>
            Promise.resolve(session.data?.user?.email ? 1 : 0)
          }
        >
          <>
            <h2>Tools</h2>
            <div className="card">
              <Link href="/sc">Sound Changer</Link>
            </div>
          </>
          <Workspace />
        </FeatureHider>
      </main>
    </>
  );
}
