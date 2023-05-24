import { NextApiRequest, NextApiResponse } from "next";
import { getIssuesService } from "server/services/issuesService";

/**
 * @dev Issues Controller
 */
export async function getIssues(req: NextApiRequest, res: NextApiResponse) {
  try {
    const issues = await getIssuesService(req.query);
    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

