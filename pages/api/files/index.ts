import {NextApiRequest, NextApiResponse} from "next";

import {withProtected} from "middleware";

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

  switch (req.method.toLowerCase()) {
  case "post":
    res.status(200).json(await uploadFiles(req));
    break;

  default:
    res.status(405);
  }


  res.end();
}

export default withProtected(handler, UPLOAD_LIMIT_MB * 1024 /* 4Mb */);
