import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export type RequestQuery = NextApiRequest["query"];

export async function collectionEndpoint<T>(
  req: NextApiRequest,
  res: NextApiResponse<T | T[]>,
  get: (query: RequestQuery) => Promise<T[]>,
  post: (resource: T) => Promise<T>
) {
  if (req.method === "GET") {
    res.status(HttpStatusCode.Ok).json(await get(req.query));
  } else if (req.method === "POST") {
    res.status(HttpStatusCode.Created).json(await post(req.body));
  } else {
    res.status(HttpStatusCode.MethodNotAllowed);
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
      res.status(HttpStatusCode.NotFound);
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
    res.status(HttpStatusCode.MethodNotAllowed);
  }
}
