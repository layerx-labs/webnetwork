import formidable from "formidable";
import fs from "fs";
import {NextApiRequest} from "next";

import IpfsStorage from "services/ipfs-service";

import {HttpBadRequestError} from "server/errors/http-errors";

import {debug} from "../../../services/logging";

export async function uploadFiles(req: NextApiRequest) {

  console.log(`\n\n BODY`,req.body,`\n\n`)

  if (!req.body || !req.body.files)
    throw new HttpBadRequestError("Missing files");

  const {files} = req.body;

  try {
    return Promise.all(files.map(file => {
      const fileName = `${new Date().toISOString()}-${file.fileName}`;
      return IpfsStorage.add(Buffer.from(file.fileData, "base64"), true, fileName);
    }))
  } catch (e) {
    debug(`Error uploading file to IPFS`, e.message);
    throw new HttpBadRequestError("Something went wrong.");
  }
}

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