import axios from "axios";

import { useAppState } from "contexts/app-state";

import { PastEventsParams } from "interfaces/api";
import { NetworkEvents, RegistryEvents, StandAloneEvents } from "interfaces/enums/events";

import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

export function useProcessEvent() {
  const  { state } = useAppState();
  const marketplace = useMarketplace();
  const { connectedChain } = useSupportedChain();

  async function processEvent(event: NetworkEvents | RegistryEvents | StandAloneEvents,
                              address?: string,
                              params: PastEventsParams = { fromBlock: 0 },
                              currentNetworkName?: string) {
    const chainId = connectedChain?.id;
    const events = connectedChain?.events;
    const registryAddress = connectedChain?.registry;
    const networkAddress = marketplace?.active?.networkAddress;

    const isRegistryEvent = event in RegistryEvents;
    const addressToSend = address || (isRegistryEvent ? registryAddress : networkAddress);

    if (!events || !addressToSend || !chainId)
      throw new Error("Missing events url, chain id or address");

    const eventsURL = new URL(`/read/${chainId}/${addressToSend}/${event}`, connectedChain?.events);
    const networkName = currentNetworkName || marketplace?.active?.name;

    return axios.get(eventsURL.href, {
    params
    })
      .then(({ data }) => {
        if (isRegistryEvent) return data;

        const entries = data.flatMap(i => {
          if (!Object.keys(i).length) return [];

          const keys = Object.keys(i[networkName]);

          if (!Object.keys(i).length) return [];

          return keys.map(key => [key, i[networkName][key]]);
        });

        return Object.fromEntries(entries);
      });
  }

  return {
    processEvent
  };
}