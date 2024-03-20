import {NextApiHandler, NextApiRequest} from "next";

export const MaxRequestSize = (handler: NextApiHandler, limitSize = 1024 /* in kb */) => {
  return (req: NextApiRequest, res) => {
    const queryLength = Buffer.from(JSON.stringify(req.query??{})).length;
    const bodyLength = Buffer.from(JSON.stringify(req.body??{})).length;

    if ((queryLength + bodyLength)/1024 >= limitSize)
      return res.status(403).json({message: "Exceeds payload limit"});


    return handler(req, res);
  }
}