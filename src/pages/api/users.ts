import { collectionEndpoint } from "@/api";
import { User } from "@/user/User";
import { getUsers, postUser } from "@/user/userEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | User[]>
) {
  await collectionEndpoint(req, res, getUsers, postUser);
}
