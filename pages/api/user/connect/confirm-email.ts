import { NextApiRequest, NextApiResponse } from "next";

import { withCORS } from "middleware";

import { error as LogError } from "services/logging";

import { get } from "server/common/user/email";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      await get(req);

      return {
        redirect: {
          destination: "/profile",
          permanent: false
        }
      };

    default:
      res.status(405);
    }
  } catch (error) {
    LogError(error);

    return {
      redirect: {
        destination: `/profile?emailVerificationError=${error.toString()}`,
        permanent: false
      }
    };
  }

  res.end();
}

export default withCORS(handler);