import {IncomingForm} from "formidable";
import fs from "fs";
import {NextApiRequest} from "next";

import IpfsStorage from "services/ipfs-service";
import {Logger} from "services/logging";

import {HttpBadRequestError, HttpFileSizeError} from "server/errors/http-errors";
import {addPointEntry} from "server/utils/points-system/add-point-entry";

export async function updateUserAvatar(req: NextApiRequest) {
  const { context: { user } } = req.body;

  const form = new IncomingForm({
    maxFileSize: 10 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject(err.httpCode === 413 ? new HttpFileSizeError() : new HttpBadRequestError(err.toString()));
      }

      const file = files.file;
      if (!file)
        return reject(new HttpBadRequestError("Missing file"));

      const fileBuffer = fs.readFileSync((file as any).filepath);

      const base64String = fileBuffer.toString('base64');

      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes((file as any).mimetype))
        throw new HttpBadRequestError("Invalid file type");

      const name = `${new Date().toISOString()}-${user.id}`;
      const [, ext] = name.split(/\.(?=[^.]*$)/g);

      const uploaded = await IpfsStorage.add(Buffer.from(base64String, "base64url"), true, undefined, ext);

      user.avatar = uploaded.hash;
      await user.save();

      await addPointEntry(user.id, "add_avatar", { hash: uploaded.hash })
        .catch(error => {
          Logger.error(error, `Failed to save avatar points`);
        });

      resolve({uploaded});
    });
  })
}