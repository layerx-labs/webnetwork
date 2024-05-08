import {NextApiRequest, NextApiResponse} from "next";

import models from "db/models";

import {Settings} from "helpers/settings";

import {withCORS} from "middleware";

async function get() {
  const settings = await models.settings.findAll({
    where: { visibility: "public" },
    raw: true,
  });

  const settingsList = new Settings(settings);

  return settingsList.raw();
}



async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "GET":
    res.status(200).json(await get());
    break;

  default:
    res.status(405).json("Method not allowed");
  }

  res.end();
}

export default withCORS(handler);