import Imgproxy from 'imgproxy';
import {NextApiRequest} from "next";
import getConfig from "next/config";

import {HttpBadRequestError} from "server/errors/http-errors";

const { serverRuntimeConfig } = getConfig();

export function getImageProxyUrl(req: NextApiRequest) {
  const {path} = req.query;
  if (!path || !path.length)
    throw new HttpBadRequestError();

  const {resize, width, height, gravity, enlarge} = req.query;

  const imgProxy = new Imgproxy({
    salt: serverRuntimeConfig.imgProxy.salt,
    key: serverRuntimeConfig.imgProxy.key,
    baseUrl: "https://cdn.bepro.network",
    encode: true,
  })

  const protocol = path[0];
  const rest = (path as string[]).slice(1).join("/");

  return imgProxy
    .builder()
    .resize(resize as any || "fit", width && +width || null, height && +height || null, !!enlarge)
    .gravity(gravity as any || "no")
    .format("jpg")
    .generateUrl(`${protocol}//${rest}`);

}