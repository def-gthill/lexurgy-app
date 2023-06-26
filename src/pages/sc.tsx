import ScPublic from "@/sc/scPublicPage";
import { IncomingMessage } from "http";

export default ScPublic;

export async function getServerSideProps(context: {
  req: IncomingMessage;
}): Promise<{ props: { baseUrl: string | null } }> {
  console.log(context);
  return { props: { baseUrl: context.req.headers.host ?? null } };
}
