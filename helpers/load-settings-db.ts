import models from "db/models";

import { Settings } from "helpers/settings";

export async function loadSettingsFromDb() {
  const settings = await models.settings.findAll({
    raw: true
  });
  const settingsList = new Settings(settings);
  return settingsList.raw();
}