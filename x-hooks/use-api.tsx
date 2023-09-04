import axios from "axios";
import {isZeroAddress} from "ethereumjs-util";

import {useAppState} from "contexts/app-state";

import { issueParser } from "helpers/issue";

import {
  CancelPrePullRequestParams,
  CreatePrePullRequestParams,
  CreateReviewParams,
  PatchUserParams,
  PastEventsParams
} from "interfaces/api";
import { NetworkEvents, RegistryEvents, StandAloneEvents } from "interfaces/enums/events";
import { IssueData } from "interfaces/issue-data";

import {api} from "services/api";

import {toastError, toastSuccess} from "../contexts/reducers/change-toaster";
import {SupportedChainData} from "../interfaces/supported-chain-data";

interface NewIssueParams {
  title: string;
  description: string;
  amount: number;
  creatorAddress: string;
  creatorGithub: string;
  repository_id: string;
}

type FileUploadReturn = {
  hash: string;
  fileName: string;
  size: string;
}[]

export default function useApi() {
  const  {state, dispatch} = useAppState();
  const DEFAULT_NETWORK_NAME = state?.Service?.network?.active?.name

  api.interceptors.request.use(config => {

    if (typeof window === 'undefined')
      return config;

    const currentWallet = sessionStorage.getItem("currentWallet") || ''
    const currentSignature = sessionStorage.getItem("currentSignature") || undefined;
    const currentChainId = sessionStorage.getItem("currentChainId") || 0;

    if (currentWallet)
      config.headers["wallet"] = currentWallet;

    if (currentSignature)
      config.headers["signature"] = currentSignature;

    if (+currentChainId)
      config.headers["chain"] = +currentChainId;

    return config;
  });

  async function getIssue(repoId: string | number,
                          ghId: string | number,
                          networkName = DEFAULT_NETWORK_NAME,
                          chainId?: string | number) {
    return api
      .get<IssueData>(`/issue/${repoId}/${ghId}/${networkName}`, { params: { chainId } })
      .then(({ data }) => issueParser(data))
      .catch(() => null);
  }

  async function createIssue(payload: NewIssueParams, networkName = DEFAULT_NETWORK_NAME) {
    return api
      .post<number>("/issue", { ...payload, networkName })
      .then(({ data }) => data)
      .catch(() => null);
  }

  async function createToken(payload: {address: string; minAmount: string; chainId: number }) {
    return api
      .post("/token", { ...payload })
      .then(({ data }) => data)
      .catch(() => null);
  }

  async function createPrePullRequest({
    networkName = DEFAULT_NETWORK_NAME,
    ...rest
  } : CreatePrePullRequestParams) {
    return api
      .post("/pull-request/", { networkName, ...rest })
      .then(({ data }) => data)
      .catch((error) => {
        throw error;
      });
  }

  async function cancelPrePullRequest({networkName = DEFAULT_NETWORK_NAME, ...rest} : CancelPrePullRequestParams) {
    return api
      .delete("/pull-request/", { data: { customNetworkName: networkName, ...rest } })
      .then(({ data }) => data)
      .catch((error) => {
        throw error;
      });
  }

  async function joinAddressToUser({ wallet, ...rest } : PatchUserParams): Promise<boolean> {
    return api.patch(`/user/connect`, { wallet, ...rest });
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

  async function createReviewForPR({
    networkName = DEFAULT_NETWORK_NAME,
    event = "COMMENT",
    ...rest
  } : CreateReviewParams) {
    return api
      .put("/pull-request/review", { networkName, event, ...rest })
      .then((response) => response)
      .catch(error => {
        throw error;
      });
  }

  async function removeUser(address: string, githubLogin: string) {
    return api
      .delete(`/user/${address}/${githubLogin}`)
      .then(({ status }) => status === 200);
  }

  async function uploadFiles(files: File | File[]): Promise<FileUploadReturn> {
    const form = new FormData();
    const isArray = Array.isArray(files);
    if (isArray) {
      files?.forEach(async (file, index) => {
        form.append(`file${index + 1}`, file);
      });
    } else {
      form.append("file", files);
    }

    return api.post("/files", form).then(({ data }) => data);
  }

  async function updateNetwork(networkInfo) {
    return api
      .put("/network", { ...networkInfo })
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }

  async function updateVisibleBounty(managmentInfo: {
    issueId: string;
    visible: boolean;
    creator: string;
    networkAddress: string;
    accessToken: string;
    override: boolean;
  }) {
    return api
      .put("/network/management", { ...managmentInfo })
      .then((response) => response)
      .catch((error) => {
        throw error;
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

  async function saveNetworkRegistry(wallet: string, registryAddress: string) {
    return api.post("setup/registry", { wallet, registryAddress })
      .then(({ data }) => data)
      .catch((error) => {
        throw error;
      });
  }

  async function addSupportedChain(chain) {
    chain.loading = true;
    return api.post(`chains`, chain)
      .then(({status}) => status === 200)
      .catch(e => {
        console.error(`failed to addSupportedChain`, e);
        return false;
      })
      .finally(() => {
        chain.loading = false;
      })
  }

  async function deleteSupportedChain(chain) {
    chain.loading = true;

    return api.delete(`chains?id=${chain.chainId}`)
      .then(({status}) => {
        dispatch(status === 200 ? toastSuccess('deleted chain') : toastError('failed to delete'));
        return status === 200
      })
      .catch(e => {
        console.error(`failed to addSupportedChain`, e);
        return false;
      })
      .finally(() => {
        chain.loading = false;
      })
  }

  async function patchSupportedChain(chain, patch: Partial<SupportedChainData>) {
    return api.patch(`chains`, {...chain, ...patch})
      .then(({status}) => status === 200)
      .catch(e => {
        console.error(`failed to patchSupportedChain`, e);
        return false;
      })
      .finally(() => {
        chain.loading = false;
      })
  }

  return {
    createIssue,
    createToken,
    createPrePullRequest,
    createReviewForPR,
    getIssue,
    joinAddressToUser,
    processEvent,
    removeUser,
    updateNetwork,
    updateVisibleBounty,
    uploadFiles,
    cancelPrePullRequest,
    resetUser,
    createNFT,
    saveNetworkRegistry,
    addSupportedChain,
    deleteSupportedChain,
    updateChainRegistry,
    patchSupportedChain
  };
}
