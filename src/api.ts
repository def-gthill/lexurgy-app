import { RequiredKeys } from "@/models/RequiredKeys";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getOrCreateUserByUsername } from "@/user/userEndpoint";
import { HttpStatusCode } from "axios";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

export type RequestQuery = NextApiRequest["query"];

export async function collectionEndpoint<T, S>(
  req: NextApiRequest,
  res: NextApiResponse<S[]>,
  get: (query: RequestQuery, userId: string) => Promise<S[]>
): Promise<void>;
export async function collectionEndpoint<T, S>(
  req: NextApiRequest,
  res: NextApiResponse<S | S[]>,
  get: (query: RequestQuery, userId: string) => Promise<S[]>,
  post: (resource: T, userId: string) => Promise<S>
): Promise<void>;
export async function collectionEndpoint<T, S>(
  req: NextApiRequest,
  res: NextApiResponse<S | S[]>,
  get: (query: RequestQuery, userId: string) => Promise<S[]>,
  post?: (resource: T, userId: string) => Promise<S>
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
  get: (id: string, userId: string) => Promise<T[]>,
  delete_: (id: string, userId: string) => Promise<T[]>
) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);
  const username = session?.user?.email;
  if (!username) {
    res.status(HttpStatusCode.Unauthorized).json("Not signed in");
  } else if (typeof id !== "string") {
    res.status(HttpStatusCode.BadRequest).json('Parameter "id" not set');
  } else if (req.method === "GET") {
    const user = await getOrCreateUserByUsername(username);
    const result = await get(id, user.id);
    if (result.length === 0) {
      res.status(HttpStatusCode.NotFound).json("Not found");
    } else {
      res.status(HttpStatusCode.Ok).json(result[0]);
    }
  } else if (req.method === "DELETE") {
    const user = await getOrCreateUserByUsername(username);
    const result = await delete_(id, user.id);
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

export function addId<T extends { id?: string }>(
  object: T
): RequiredKeys<T, "id"> {
  return { id: object.id ?? crypto.randomUUID(), ...object };
}
