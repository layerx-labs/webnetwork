import axios from "axios";
import {isZeroAddress} from "ethereumjs-util";

import {useAppState} from "contexts/app-state";

import { PastEventsParams} from "interfaces/api";
import {NetworkEvents, RegistryEvents, StandAloneEvents} from "interfaces/enums/events";

import {api} from "services/api";

import {toastError, toastSuccess} from "../contexts/reducers/change-toaster";
import {SupportedChainData} from "../interfaces/supported-chain-data";

export default function useApi() {
  const  {state, dispatch} = useAppState();
  const DEFAULT_NETWORK_NAME = state?.Service?.network?.active?.name

  // api.interceptors.request.use(config => {
  //
  //   if (typeof window === 'undefined')
  //     return config;
  //
  //   const currentWallet = sessionStorage.getItem("currentWallet") || ''
  //   const currentSignature = sessionStorage.getItem("currentSignature") || undefined;
  //   const currentChainId = sessionStorage.getItem("currentChainId") || 0;
  //
  //   if (currentWallet)
  //     config.headers["wallet"] = currentWallet;
  //
  //   if (currentSignature)
  //     config.headers["signature"] = currentSignature;
  //
  //   if (+currentChainId)
  //     config.headers["chain"] = +currentChainId;
  //
  //   return config;
  // });

  async function createToken(payload: {address: string; minAmount: string; chainId: number }) {
    return api
      .post("/token", { ...payload })
      .then(({ data }) => data)
      .catch(() => null);
  }

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

  async function resetUser(address: string, githubLogin: string) {
    return api.post("/user/reset", { address, githubLogin });
  }

  async function createNFT(issueContractId: number,
                           proposalContractId: number,
                           mergerAddress: string,
                           networkName: string = DEFAULT_NETWORK_NAME) {
    return api
      .post("/nft", { issueContractId, proposalContractId, mergerAddress, networkName })
      .then(({ data }) => data)
      .catch((error) => {
        throw error;
      });
  }

  async function updateChainRegistry(chain: SupportedChainData) {

    const model: any = {
      chainId: chain.chainId,
      name: chain.chainName,
      shortName: chain.chainShortName,
      activeRPC: chain.chainRpc,
      networkId: chain.chainId,
      nativeCurrency: {
        decimals: +chain.chainCurrencyDecimals,
        name: chain.chainCurrencyName,
        symbol: chain.chainCurrencySymbol
      },
      blockScanner: chain.blockScanner,
      eventsApi: chain.eventsApi,
      registryAddress: chain.registryAddress
    }

    return api.patch<{registryAddress?: string}>(`chains`, model)
      .then(response =>
        response.status === 200 &&
        !!response.data?.registryAddress &&
        !isZeroAddress(response.data?.registryAddress))
      .catch((e) => {
        console.log(`error patching registry`, e)
        return false;
      })
  }

  return {
    createToken,
    processEvent,
    resetUser,
    createNFT,
    updateChainRegistry
  };
}
