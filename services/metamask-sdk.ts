import { MetaMaskSDK } from "@metamask/sdk";

export const instantiateSdk = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return new MetaMaskSDK();
};