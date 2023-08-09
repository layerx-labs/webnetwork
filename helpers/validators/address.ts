import getConfig from "next/config";

import { toLower } from "helpers/string";

const { publicRuntimeConfig } = getConfig();

export const AddressValidator = {
  compare: (address: string, addressToCompare: string) => toLower(address) === toLower(addressToCompare),
};

export function isAdminAddress(address: string) {
  return address && AddressValidator.compare(address, publicRuntimeConfig?.adminWallet);
}