import Sc from "@/sc/sc";
import { IncomingMessage } from "http";

export default Sc;

export async function getServerSideProps(context: {
  req: IncomingMessage;
}): Promise<{ props: { baseUrl: string | null } }> {
  return { props: { baseUrl: context.req.headers.host ?? null } };
}
