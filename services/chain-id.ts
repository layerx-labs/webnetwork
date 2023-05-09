import axios from "axios";

import { WinStorage } from "services/win-storage";

async function getChainIconsList() {
  const storage = new WinStorage('chainIconsList', 3600 * 24 * 1000);

  if (storage.value)
    return storage.value;

  try {
    const { data } = await axios.get("https://chainid.network/chain_icons.json");

    return data;
  } catch (error) {
    console.debug("Failed to getChainIconsList", error);

    return [];
  }
}

async function getChainIcon(iconName: string) {
  const icons = await getChainIconsList();

  const found = icons.find(({ name }) => name === iconName);

  if (found && found.icons.length)
    return found.icons[0].url.replace("ipfs://", "");

  return undefined;
}

export {
  getChainIconsList,
  getChainIcon
};