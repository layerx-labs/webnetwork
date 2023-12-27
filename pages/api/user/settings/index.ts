import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {Logger} from "services/logging";

import {changeAddressSettings} from "server/common/user/settings/change-address-settings";
import {getAddressSettings} from "server/common/user/settings/get-address-settings";

async function userSettingsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method.toLowerCase()) {
    case "get":
      res.status(200).json(await getAddressSettings(req));
      break;
    case "post":
      res.status(200).json(await changeAddressSettings(req, res));
      break;
    default:
      res.status(405);
    }
  } catch (e) {
    Logger.error(e, "userSettingsHandler");
    res.status(e?.status || 500).json(e?.message || e?.toString());
  }
}

Logger.changeActionName("UserSettings");
export default UserRoute(userSettingsHandler);