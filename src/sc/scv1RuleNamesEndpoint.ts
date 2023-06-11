import axios, { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[] | string>
) {
  if (req.method === "POST") {
    const response = await axios.post<string[]>(
      `${process.env.LEXURGY_SERVICES_URL}/scv1/rule-names`,
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
