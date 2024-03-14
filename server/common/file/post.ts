import {NextApiRequest} from "next";

import IpfsStorage from "services/ipfs-service";

import {HttpBadRequestError} from "server/errors/http-errors";

import {debug} from "../../../services/logging";

export async function uploadFiles(req: NextApiRequest) {

  if (!req.body || !req.body.files)
    throw new HttpBadRequestError("Missing files");

  const {files} = req.body;

  // prepare before starting the Promise.all, so we can escape earlier
  const preparedPayloads = files.map(({fileName, fileData}) => {
    const name = `${new Date().toISOString()}-${fileName}`;
    const [, ext] = name.split(/\.(?=[^.]*$)/g);
    const [mime, data] = fileData.split(",");

    const acceptedMimes = [/image\/(jpeg|png|gif|svg\+xml)/, /application\/pdf/];

    const validMime = acceptedMimes.some(pattern => pattern.test(mime));

    if (!validMime)
      throw new HttpBadRequestError("invalid mime");

    return {name, ext, data}
  });

  try {
    return Promise.all(preparedPayloads.map(({name, ext, data}) =>
      IpfsStorage.add(Buffer.from(data, "base64url"), true, name, ext)));
  } catch (e) {
    debug(`Error uploading file to IPFS`, e.message);
    throw new HttpBadRequestError("Something went wrong.");
  }
}