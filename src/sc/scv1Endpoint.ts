import axios, { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Scv1Response from "./Scv1Response";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Scv1Response | string>
) {
  if (req.method === "POST") {
    const response = await axios.post<Scv1Response>(
      `${process.env.LEXURGY_SERVICES_URL}/scv1`,
      req.body,
      { headers: { Authorization: process.env.LEXURGY_SERVICES_API_KEY } }
    );
    res.status(response.status).json(response.data);
  } else {
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .setHeader("allow", "POST")
      .json("");
  }
}
