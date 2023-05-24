import { NextApiRequest, NextApiResponse } from "next";
import { getIssues } from "server/controllers/issuesController";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    getIssues(req, res);
    break;
  default:
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
