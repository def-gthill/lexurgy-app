import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const username = session?.user?.email;
  if (
    username &&
    (username === process.env.NEXTAUTH_ADMIN_EMAIL ||
      process.env.NEXTAUTH_EXPERIMENTAL_FEATURE_EMAILS?.split(",")?.includes(
        username
      ))
  ) {
    res.status(200).json({ featureAccess: "experimental" });
  } else {
    res.status(200).json({ featureAccess: "general" });
  }
}
