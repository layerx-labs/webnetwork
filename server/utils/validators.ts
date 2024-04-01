import { isZeroAddress } from "ethereumjs-util";
import { isAddress as web3IsAddress } from "web3-utils";

export function isAddress(address: string) {
  return !isZeroAddress(address) && web3IsAddress(address);
}