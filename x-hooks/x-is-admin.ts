import getConfig from "next/config";

import { useUserStore } from "./stores/user/user.store";

export default function isAdmin() {
  const { currentUser } = useUserStore();
  const {publicRuntimeConfig} = getConfig();

  return currentUser?.walletAddress.toLowerCase() === publicRuntimeConfig.adminWallet.toLowerCase();
}