import {NextApiRequest, NextApiResponse} from "next";

import {withProtected} from "middleware";

import {error as LogError, Logger} from "services/logging";

import {uploadFiles} from "server/common/file/post";

const UPLOAD_LIMIT_MB = 4;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: `${UPLOAD_LIMIT_MB}mb`,
    }
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "post":
      res.status(200).json(await uploadFiles(req));
      break;

    default:
      res.status(405);
    }
  } catch (error) {
    LogError(`Error uploading files`, error);
    res.status(error?.status || 500).json(error?.message || error?.toString());
  }

  res.end();
}

Logger.changeActionName(`Files`);
export default withProtected(handler, UPLOAD_LIMIT_MB * 1024 /* 4Mb */);
