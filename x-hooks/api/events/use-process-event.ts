import axios from "axios";

import { useAppState } from "contexts/app-state";

import { PastEventsParams } from "interfaces/api";
import { NetworkEvents, RegistryEvents, StandAloneEvents } from "interfaces/enums/events";

export function useProcessEvent() {
  const  { state } = useAppState();

  async function processEvent(event: NetworkEvents | RegistryEvents | StandAloneEvents,
                              address?: string,
                              params: PastEventsParams = { fromBlock: 0 },
                              currentNetworkName?: string) {
    const chainId = state.connectedChain?.id;
    const events = state.connectedChain?.events;
    const registryAddress = state.connectedChain?.registry;
    const networkAddress = state.Service?.network?.active?.networkAddress;

    const isRegistryEvent = event in RegistryEvents;
    const addressToSend = address || (isRegistryEvent ? registryAddress : networkAddress);

    if (!events || !addressToSend || !chainId)
      throw new Error("Missing events url, chain id or address");

    const eventsURL = new URL(`/read/${chainId}/${addressToSend}/${event}`, state.connectedChain?.events);
    const networkName = currentNetworkName || state.Service?.network?.active?.name;

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