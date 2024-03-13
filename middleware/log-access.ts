import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

import {debug, log, Logger} from "services/logging";

export const LogAccess = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      url,
      method,
      headers: {"x-forwarded-for": xForwarded, "cf-connecting-ip": cfConnectingIp},
      socket: {remoteAddress}
    } = req;
    const _query = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
    const query = Object.keys(_query).length ? _query : null;
    const body = req?.body || null;

    const pathname = url.split('/api')[1].replace(/\?.+/g, '');

    const payload = (query || body) ? ({ ... query ? {query} : {}, ... body ? {body} : {}}) : '';

    log(`access`, {
      pathname,
      method,
      headers: req?.headers,
      connection: {xForwarded, remoteAddress, cfConnectingIp},
      payload,
    });

    try {
      await handler(req, res);

      if (res.statusCode >= 400)
        Logger.warn(`Answered with ${res.statusCode}`, res.statusMessage)

      debug(`access-end`, {method, pathname});

    } catch (e) {
      Logger.error(e, `access-error`, {method, pathname, payload});
      res.status(e?.status || 500).end();
    } finally {
      Logger.changeActionName(``); // clean action just in case;
    }
  }
}