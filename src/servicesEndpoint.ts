import axios, { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const endpoint = req.query.endpoint;
    const response = await axios.post(
      `${process.env.LEXURGY_SERVICES_URL}/${endpoint}`,
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
