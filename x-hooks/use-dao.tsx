import { useDappkit } from "@taikai/dappkit-react";
import { coinbaseWallet } from "@taikai/dappkit-react/dist/connectors/wallets/coinbase-wallet";
import { metamaskWallet } from "@taikai/dappkit-react/dist/connectors/wallets/metamask-wallet";
import { isZeroAddress } from "ethereumjs-util";
import { useRouter } from "next/router";
import { isAddress } from "web3-utils";

import {SUPPORT_LINK, UNSUPPORTED_CHAIN} from "helpers/constants";
import { lowerCaseCompare } from "helpers/string";
import { getProviderNameFromConnection } from "helpers/wallet-providers";

import { StorageKeys } from "interfaces/enums/storage-keys";
import { WalletProviders } from "interfaces/enums/wallet-providers";
import {SupportedChainData} from "interfaces/supported-chain-data";

import DAO from "services/dao-service";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useSupportedChain from "x-hooks/use-supported-chain";

export function useDao() {
  const dappkitReact = useDappkit();
  const { replace, asPath } = useRouter();

  const { supportedChains, updateConnectedChain, get } = useSupportedChain();

  const { currentUser } = useUserStore();
  const {
    service: daoService,
    updateService,
    updateServiceStarting,
    ...daoStore
  } = useDaoStore();

  function isChainConfigured(chain: SupportedChainData) {
    return isAddress(chain?.registryAddress) && !isZeroAddress(chain?.registryAddress);
  }

  async function disconnect () {
    const isMetamask = getProviderNameFromConnection(dappkitReact.connection) === WalletProviders.MetaMask;
    const walletConnector = isMetamask ? metamaskWallet : coinbaseWallet;
    if (walletConnector?.deactivate)
      walletConnector?.deactivate();
    else
      walletConnector?.resetState();
    dappkitReact.disconnect();
  }

  async function connect () {
    const lastProvider = window.localStorage.getItem(StorageKeys.lastProviderConnected);
    const selectedProvider = (window?.ethereum as any)?.providerMap?.get(lastProvider);
    if (selectedProvider) {
      if ((window?.ethereum as any)?.setSelectedProvider)
        (window.ethereum as any).setSelectedProvider(selectedProvider);

      dappkitReact
        .setProvider(selectedProvider)
        .catch(console.debug);
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
      if (!dappkitReact?.connection)
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
      const needsToUpdateConnection = !!daoService?.web3Host;
      if (!!daoService && isSameChain && isSameNetworkAddress && isSameRegistryAddress && !needsToUpdateConnection)
        return;
      const isChainEqualToConnected = +dappkitReact?.chainId === +chainToConnect?.chainId;
      const daoProps = isChainEqualToConnected ?
        { web3Connection: dappkitReact?.connection } :
        { web3Host: chainToConnect?.chainRpc };
      const dao = !daoService || !isSameChain || needsToUpdateConnection ?
        new DAO({
          ...daoProps,
          registryAddress: registryToLoad
        }) : daoService;
      if (!isChainEqualToConnected)
        await dao.start();
      if (!isSameRegistryAddress || needsToUpdateConnection)
        await dao.loadRegistry();
      if (!!networkAddress && !isSameNetworkAddress || needsToUpdateConnection)
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
    const chain = get()?.chains?.find(c => +chainId === +c?.chainId);

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

  return {
    connect,
    disconnect,
    start,
    updateChain
  };
}