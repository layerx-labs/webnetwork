import { Web3Connection } from "@taikai/dappkit";
import { isZeroAddress } from "ethereumjs-util";
import { useRouter } from "next/router";
import type { provider as Provider } from "web3-core";
import { isAddress } from "web3-utils";

import {SUPPORT_LINK, UNSUPPORTED_CHAIN} from "helpers/constants";
import handleEthereumProvider from "helpers/handle-ethereum-provider";
import { lowerCaseCompare } from "helpers/string";

import {SupportedChainData} from "interfaces/supported-chain-data";

import DAO from "services/dao-service";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import useChain from "x-hooks/use-chain";
import { metamaskWallet, useDappkit } from "x-hooks/use-dappkit";
import useSupportedChain from "x-hooks/use-supported-chain";

import { useLoadersStore } from "./stores/loaders/loaders.store";
import { useUserStore } from "./stores/user/user.store";

export function useDao() {
  const { replace, asPath } = useRouter();

  const { currentUser } = useUserStore();
  const { findSupportedChain } = useChain();
  const {
    service: daoService,
    serviceStarting,
    updateService,
    updateServiceStarting,
    ...daoStore
  } = useDaoStore();
  const { supportedChains, updateConnectedChain } = useSupportedChain();
  const { disconnect: dappkitDisconnect, connection, setProvider, setConnection } = useDappkit();
  const { updateMissingMetamask } = useLoadersStore();

  function isChainConfigured(chain: SupportedChainData) {
    return isAddress(chain?.registryAddress) && !isZeroAddress(chain?.registryAddress);
  }

  function isServiceReady() {
    return !serviceStarting;
  }

  function disconnect () {
    return dappkitDisconnect();
  }

  /**
   * Enables the user/dapp to connect to the active DAOService
   */
  async function connect(): Promise<string | null> {
    try {
      await metamaskWallet.activate();

      if (!metamaskWallet.provider) return null;

      setProvider(null)
      setProvider(metamaskWallet.provider as unknown as Provider);
      const web3Connection = new Web3Connection({ 
        web3CustomProvider: metamaskWallet.provider,
        skipWindowAssignment: true
      });

      return web3Connection.connect()
        .then((connected) => {
          setConnection(web3Connection);
          if (!connected) {
            console.debug(`Failed to connect`, daoService);

            return "0x00";
          }

          return web3Connection.getAddress();
        })
        .then(address => {
          if (address === "0x00") return null;

          handleEthereumProvider(updateChain, () => updateMissingMetamask(true))
          return address;
        })
        .catch(error => {
          console.debug(`Failed to connect`, error);
          return null;
        });
    } catch(error) {
      console.debug(`Failed to connect`, error);
      return null;
    }
  }
  async function start({
    chainId,
    networkAddress,
    registryAddress,
  }: {
    chainId: number;
    networkAddress?: string;
    registryAddress?: string;
  }): Promise<void> {
    try {
      updateServiceStarting(true);
      if (!connection)
        throw new Error("Missing connection");
      if (!supportedChains?.length)
        throw new Error("No supported chains found");
      const chainToConnect = supportedChains.find(c => +c.chainId === +chainId);
      if (!!chainId && !chainToConnect)
        throw new Error("Invalid chainId provided");
      if (!isChainConfigured(chainToConnect) && !asPath.includes("setup")) {
        if (currentUser?.isAdmin ) {
          replace("/setup");
          return;
        }
        throw new Error("Chain is not configured");
      }
      const registryToLoad = (registryAddress || chainToConnect.registryAddress);
      const isSameChain = chainId === daoStore.chainId;
      const isSameNetworkAddress = lowerCaseCompare(networkAddress, daoStore.networkAddress);
      const isSameRegistryAddress = registryToLoad === daoStore.registryAddress;
      if (!!daoService && isSameChain && isSameNetworkAddress && isSameRegistryAddress)
        return;
      const dao = !daoService || !isSameChain ?
        new DAO({
          web3Connection: connection,
          registryAddress: registryToLoad
        }) : daoService;
      if (!isSameRegistryAddress)
        await dao.loadRegistry();
      if (!!networkAddress && !isSameNetworkAddress)
        await dao.loadNetwork(networkAddress);
      window.DAOService = dao;
      const address = !isSameChain ? networkAddress : networkAddress || daoStore.networkAddress;
      updateService(dao, chainId, registryToLoad, address);
    } catch (e) {
      throw e;
    } finally {
      updateServiceStarting(false);
    }
  }

  function updateChain(chainId: number) {
    const chain = findSupportedChain({ chainId });

    sessionStorage.setItem("currentChainId", chainId.toString());

    return updateConnectedChain({
      id: (chain?.chainId || chainId)?.toString(),
      name: chain?.chainName || UNSUPPORTED_CHAIN,
      shortName: chain?.chainShortName?.toLowerCase() || UNSUPPORTED_CHAIN,
      explorer: chain?.blockScanner || SUPPORT_LINK,
      events: chain?.eventsApi,
      registry: chain?.registryAddress,
      lockAmountForNetworkCreation: chain?.lockAmountForNetworkCreation,
      networkCreationFeePercentage: chain?.networkCreationFeePercentage,
      closeFeePercentage: chain?.closeFeePercentage,
      cancelFeePercentage: chain?.cancelFeePercentage,
    })
  }

  function listenChainChanged() {
    if (!window.ethereum || !supportedChains?.length)
      return;

    handleEthereumProvider(updateChain, () => updateMissingMetamask(true))
  }

  return {
    connect,
    disconnect,
    start,
    isServiceReady,
    listenChainChanged
  };
}