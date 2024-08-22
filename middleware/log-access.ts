import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";

import {error, info, warn} from "services/logging";

import {elasticLoggerMaker} from "../services/elastic-logger";

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

    const payload = {
      ... (query ? { query } : {}),
      ... (body ? { body } : {})
    };

    elasticLoggerMaker(`bepro-access-logs`)
      .log(`debug`, ["Access", [{
        _type: "access",
        payload: { data: JSON.stringify(payload) },
        method,
        pathname,
        headers: { ...req?.headers, cookie: "removed" },
        connection: { xForwarded, remoteAddress, cfConnectingIp }
      }]])

    try {
      info(`access`, {pathname, payload, method,});
      await handler(req, res);

      if (res.statusCode >= 400)
        warn(`Answered with ${res.statusCode}`, res.statusMessage)

    } catch (e) {
      error(`access-error`, {method, pathname, payload, errorMessage: e?.message});
      res.status(e?.status || e?.code || 500).json({message: e?.message});
      res.end();
    }
  }
}