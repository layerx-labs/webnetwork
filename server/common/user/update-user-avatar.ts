import { NextApiRequest } from "next";

import IpfsStorage from "services/ipfs-service";
import { Logger } from "services/logging";

import { HttpBadRequestError } from "server/errors/http-errors";
import { addPointEntry } from "server/utils/points-system/add-point-entry";

export async function updateUserAvatar(req: NextApiRequest) {
  const { files, context: { user } } = req.body;

  const avatarFile = files?.at(0);

  if (!avatarFile)
    throw new HttpBadRequestError("Missing file");

  const { fileName, fileData } = avatarFile;
  const [mime, data] = fileData.split(",");

  if (!/image\/(jpeg|png)/.test(mime))
    throw new HttpBadRequestError("Invalid file type");

  const name = `${new Date().toISOString()}-${fileName}`;
  const [, ext] = name.split(/\.(?=[^.]*$)/g);

  const updloaded = await IpfsStorage.add(Buffer.from(data, "base64url"), true, undefined, ext);

  user.avatar = updloaded.hash;
  await user.save();

  await addPointEntry(user.id, "add_avatar", { hash: updloaded.hash })
    .catch(error => {
      Logger.error(error, `Failed to save avatar points`);
    });
}