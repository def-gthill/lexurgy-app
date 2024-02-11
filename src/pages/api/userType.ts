import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserType from "@/user/UserType";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const username = session?.user?.email;
  let result: UserType = {
    hasAdminAccess: false,
    hasExperimentalAccess: false,
  };
  if (username && username === process.env.NEXTAUTH_ADMIN_EMAIL) {
    result.hasAdminAccess = true;
    result.hasExperimentalAccess = true;
  }
  if (
    username &&
    process.env.NEXTAUTH_EXPERIMENTAL_FEATURE_EMAILS?.split(",")?.includes(
      username
    )
  ) {
    result.hasExperimentalAccess = true;
  }
  res.status(200).json(result);
}
