import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

import {debug, log, Logger} from "../services/logging";

export const LogAccess = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const {url, method} = req as any;
    const _query = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
    const query = Object.keys(_query).length ? _query : null;
    const body = req?.body || null;

    const pathname = url.split('/api')[1].replace(/\?.+/g, '');

    const rest = (query || body) ? ({ ... query ? {query} : {}, ... body ? {body} : {}}) : '';

    log(`${method} access`, pathname);
    if (rest)
      debug(`${method} access-payload`, pathname, rest);

    try {
      await handler(req, res);

      if (res.statusCode >= 400)
        Logger.warn(`Answered with ${res.statusCode}`, res.statusMessage)

      debug(`${method} access-end`, pathname)
    } catch (e) {
      Logger.error(e, `${method}`, pathname, e?.toString(), rest);
    }
    Logger.changeActionName(``); // clean action just in case;
  }
}