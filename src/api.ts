import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export type RequestQuery = NextApiRequest["query"];

export async function collectionEndpoint<T>(
  req: NextApiRequest,
  res: NextApiResponse<T | T[]>,
  get: (query: RequestQuery) => Promise<T[]>,
  post: (resource: T) => Promise<T>
) {
  if (req.method == "GET") {
    res.status(HttpStatusCode.Ok).json(await get(req.query));
  } else if (req.method == "POST") {
    res.status(HttpStatusCode.Created).json(await post(req.body));
  } else {
    res.status(HttpStatusCode.MethodNotAllowed);
  }
}
