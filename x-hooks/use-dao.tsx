import { useState } from "react";

import {isZeroAddress} from "ethereumjs-util";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {isAddress} from "web3-utils";

import {useAppState} from "contexts/app-state";
import { changeMissingMetamask } from "contexts/reducers/update-show-prop";

import {SUPPORT_LINK, UNSUPPORTED_CHAIN} from "helpers/constants";
import handleEthereumProvider from "helpers/handle-ethereum-provider";
import { lowerCaseCompare } from "helpers/string";

import {SupportedChainData} from "interfaces/supported-chain-data";

import DAO from "services/dao-service";

import useChain from "x-hooks/use-chain";

import { useDaoStore } from "./stores/dao/dao.store";
import useMarketplace from "./use-marketplace";
import useSupportedChain from "./use-supported-chain";


export function useDao() {
  const [isLoadingChangingChain, setIsLoadingChangingChain] = useState(false);
  const session = useSession();
  const { replace, asPath, pathname } = useRouter();

  const marketplace = useMarketplace();
  const { state, dispatch } = useAppState();
  const { findSupportedChain } = useChain();
  const { service: daoService, serviceStarting, updateService, updateServiceStarting } = useDaoStore();
  const { supportedChains, connectedChain, updateConnectedChain } = useSupportedChain();

  function isChainConfigured(chain: SupportedChainData) {
    return isAddress(chain?.registryAddress) && !isZeroAddress(chain?.registryAddress);
  }

  function isServiceReady() {
    return !serviceStarting && !isLoadingChangingChain;
  }

  /**
   * Enables the user/dapp to connect to the active DAOService
   */
  function connect(): Promise<string | null> {
    if (!state.Service?.web3Connection) return;

    return state.Service?.web3Connection?.connect()
      .then((connected) => {
        if (!connected) {
          console.debug(`Failed to connect`, state.Service);

          return "0x00";
        }

        return state.Service?.web3Connection?.getAddress();
      })
      .then(address => {
        if (address === "0x00") return null;

        handleEthereumProvider(updateChain, () => dispatch(changeMissingMetamask(true)))
        return address;
      })
      .catch(error => {
        console.debug(`Failed to connect`, error);
        return null;
      })
  }

  /**
   * Change network to a known address if not the same
   * @param networkAddress
   */
  async function changeNetwork(chainId = '', address = '') {
    const networkAddress = address || marketplace?.active?.networkAddress;
    const chain_id = +(chainId || marketplace?.active?.chain_id);

    if (!daoService ||
        !networkAddress ||
        !chain_id ||
        isLoadingChangingChain ||
        serviceStarting)
      return;

    if (daoService?.network?.contractAddress === networkAddress)
      return;

    const networkChain = findSupportedChain({ chainId: chain_id });

    if (!networkChain) return;

    const withWeb3Host = !!daoService?.web3Host;

    if (!withWeb3Host && chain_id !== +state.Service?.web3Connection?.web3?.currentProvider?.chainId ||
        withWeb3Host && networkChain.chainRpc !== daoService?.web3Host)
      return;

    console.debug("Starting network");

    updateServiceStarting(true)

    return  daoService
        .loadNetwork(networkAddress)
        .then(started => {
          if (!started) {
            console.error("Failed to load network", networkAddress);
            return false;
          }
          listenChainChanged();
          console.debug("Network started");
          return true;
        })
        .catch(error => {
          console.error("Error loading network", error);
          return false;
        })
        .finally(() => {
          updateServiceStarting(false)
        });
  }

  /**
   * Starts DAOService
   * dispatches changeNetwork() to active network
   */
  async function start() {
    if (session.status === "loading" ||
        session.status === "authenticated" && !state.currentUser?.connected) {
      // console.debug("Session not loaded yet");
      return;
    }

    if (!supportedChains?.length) {
      // console.debug("No supported chains found");
      return;
    }

    const networkChainId = marketplace?.active?.chain_id;
    const isOnNetwork = pathname?.includes("[network]");

    if (isOnNetwork && !networkChainId) {
      console.debug("Is on network, but network data was not loaded yet");
      return;
    }

    const activeNetworkChainId = marketplace?.active?.chain_id;

    const chainIdToConnect = isOnNetwork && activeNetworkChainId ? activeNetworkChainId : 
      (connectedChain?.name === UNSUPPORTED_CHAIN ? undefined : connectedChain?.id);

    const chainToConnect = supportedChains.find(({ isDefault, chainId }) => 
      chainIdToConnect ? +chainIdToConnect === +chainId : isDefault);

    if (!chainToConnect) {
      console.debug("No default or network chain found");
      return;
    }

    const isConfigured = isChainConfigured(chainToConnect);

    if (!isConfigured) {
      console.debug("Chain not configured", chainToConnect);

      if (state.currentUser?.isAdmin && !asPath.includes("setup") && !asPath.includes("connect-account")) {
        replace("/setup");

        return;
      }
    }

    const web3Connection = state.Service?.web3Connection;
    const isConnected = !!web3Connection?.web3?.currentProvider?._state?.isConnected;
    const shouldUseWeb3Connection = +chainIdToConnect === +connectedChain.id && isConnected;

    const isSameWeb3Host = 
      chainToConnect.chainRpc === daoService?.web3Host && !shouldUseWeb3Connection || 
      shouldUseWeb3Connection && !daoService?.web3Host;
    const isSameRegistry = lowerCaseCompare(chainToConnect?.registryAddress, daoService?.registryAddress);

    if (isSameWeb3Host && isSameRegistry && !isConnected) {
      console.debug("Already connected to this web3Host or the service is still starting");
      return;
    }

    console.debug("Starting DAOService");

    const { chainRpc: web3Host, registryAddress: _registry } = chainToConnect;

    const registryAddress = isConfigured ? _registry : undefined;

    const daoProps = shouldUseWeb3Connection ? { web3Connection, registryAddress } : { web3Host, registryAddress };

    const newDaoService = new DAO(daoProps);

    if (!shouldUseWeb3Connection)
      await newDaoService.start()
        .catch(error => {
          console.debug("Error starting daoService", error);
        });

    if (registryAddress)
      await newDaoService.loadRegistry()
        .catch(error => console.debug("Failed to load registry", error));

    console.debug("DAOService started", daoProps);

    window.DAOService = newDaoService;

    updateService(newDaoService)
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
      registry: chain?.registryAddress
    })
  }

  function listenChainChanged() {
    if (!window.ethereum || !supportedChains?.length)
      return;

    handleEthereumProvider(updateChain, () => dispatch(changeMissingMetamask(true)))
  }

  return {
    changeNetwork,
    connect,
    start,
    isServiceReady,
    listenChainChanged
  };
}