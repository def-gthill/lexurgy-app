import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./pages/api/auth/[...nextauth]";
import { getOrCreateUserByUsername } from "./user/userEndpoint";

export type RequestQuery = NextApiRequest["query"];

export async function collectionEndpoint<T>(
  req: NextApiRequest,
  res: NextApiResponse<T[]>,
  get: (query: RequestQuery, userId: string) => Promise<T[]>
): Promise<void>;
export async function collectionEndpoint<T>(
  req: NextApiRequest,
  res: NextApiResponse<T | T[]>,
  get: (query: RequestQuery, userId: string) => Promise<T[]>,
  post: (resource: T, userId: string) => Promise<T>
): Promise<void>;
export async function collectionEndpoint<T>(
  req: NextApiRequest,
  res: NextApiResponse<T | T[]>,
  get: (query: RequestQuery, userId: string) => Promise<T[]>,
  post?: (resource: T, userId: string) => Promise<T>
) {
  const session = await getServerSession(req, res, authOptions);
  const username = session?.user?.email;
  if (!username) {
    res.status(HttpStatusCode.Unauthorized).json([]);
  } else if (req.method === "GET") {
    const user = await getOrCreateUserByUsername(username);
    res.status(HttpStatusCode.Ok).json(await get(req.query, user.id));
  } else if (post && req.method === "POST") {
    const user = await getOrCreateUserByUsername(username);
    res.status(HttpStatusCode.Created).json(await post(req.body, user.id));
  } else {
    let allow = "GET";
    if (post) {
      allow = `${allow}, POST`;
    }
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .setHeader("allow", allow)
      .json([]);
  }
}

export async function resourceEndpoint<T>(
  req: NextApiRequest,
  res: NextApiResponse<T | string>,
  get: (id: string) => Promise<T[]>,
  delete_: (id: string) => Promise<T[]>
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    res.status(HttpStatusCode.BadRequest).json('Parameter "id" not set');
  } else if (req.method === "GET") {
    const result = await get(id);
    if (result.length === 0) {
      res.status(HttpStatusCode.NotFound).json("Not found");
    } else {
      res.status(HttpStatusCode.Ok).json(result[0]);
    }
  } else if (req.method === "DELETE") {
    const result = await delete_(id);
    if (result.length === 0) {
      res.status(HttpStatusCode.Ok).json("Not found");
    } else {
      res.status(HttpStatusCode.Ok).json(`Object ${result[0]} deleted`);
    }
  } else {
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .setHeader("allow", "GET, DELETE")
      .json("");
  }
}
