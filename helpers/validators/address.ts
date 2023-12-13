import getConfig from "next/config";

import {lowerCaseCompare} from "helpers/string";
import {isAddress} from "../is-address";

const { publicRuntimeConfig } = getConfig();

export class AddressValidator {
  static compare(address: string, addressToCompare: string) {
    return lowerCaseCompare(address, addressToCompare);
  }

  static isAdmin(address: string) {
    return this.compare(address, publicRuntimeConfig?.adminWallet);
  }

  static isAddress(address: string) {
    return isAddress(address);
  }
}