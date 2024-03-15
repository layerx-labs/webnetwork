import {NextApiRequest, NextApiResponse} from "next";

import {UserRoute} from "middleware";

import {changeAddressSettings} from "server/common/user/settings/change-address-settings";
import {getAddressSettings} from "server/common/user/settings/get-address-settings";

async function userSettingsHandler(req: NextApiRequest, res: NextApiResponse) {

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

}


export default UserRoute(userSettingsHandler);