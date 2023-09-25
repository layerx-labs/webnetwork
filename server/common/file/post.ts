import formidable from "formidable";
import fs from "fs";
import { NextApiRequest } from "next";

import IpfsStorage from "services/ipfs-service";

import { HttpBadRequestError } from "server/errors/http-errors";

export async function post(req: NextApiRequest) {
  const formData = await new Promise<{ fields; files: object }>((resolve, reject) => {
    new formidable.IncomingForm().parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve({ fields, files });
    });
  });

  const values = Object.values(formData.files);

  if (values.length < 1)
    throw new HttpBadRequestError("Missing files");

  const uploadFiles = values.map(async (file) => 
    IpfsStorage.add(fs.readFileSync(file.filepath), false, file.originalFilename));

  const files = await Promise.all(uploadFiles);

  return files;
}