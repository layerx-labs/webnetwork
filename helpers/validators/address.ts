import getConfig from "next/config";

import { toLower } from "helpers/string";

const { publicRuntimeConfig } = getConfig();

export function isAdminAddress(address: string) {
  return address && toLower(address) === toLower(publicRuntimeConfig?.adminWallet);
}