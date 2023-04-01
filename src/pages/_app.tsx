import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import WorkspaceNavigation from "@/components/WorkspaceNavigation";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <WorkspaceNavigation />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
