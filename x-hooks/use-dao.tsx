import { isZeroAddress } from "ethereumjs-util";
import { useRouter } from "next/router";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import { provider as Provider } from "web3-core";
import { isAddress } from "web3-utils";

import { SUPPORT_LINK, UNSUPPORTED_CHAIN } from "helpers/constants";
import { lowerCaseCompare } from "helpers/string";

import {SupportedChainData} from "interfaces/supported-chain-data";

import DAO from "services/dao-service";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useSupportedChain from "x-hooks/use-supported-chain";

export function useDao() {
  const account = useAccount();
  const connectors = useConnectors();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { replace, asPath } = useRouter();

  const { supportedChains, updateConnectedChain, get } = useSupportedChain();

  const { currentUser, updateCurrentUser } = useUserStore();
  const {
    service: daoService,
    updateService,
    updateServiceStarting,
    ...daoStore
  } = useDaoStore();

  function isChainConfigured(chain: SupportedChainData) {
    return isAddress(chain?.registryAddress) && !isZeroAddress(chain?.registryAddress);
  }

  function getLastConnector () {
    const recentConnectorId = window.localStorage.getItem("wagmi.recentConnectorId")?.replaceAll("\"", "");
    if (!recentConnectorId)
      return null;
    return connectors?.find(c => lowerCaseCompare(c?.id, recentConnectorId));
  }

  async function connect (): Promise<boolean> {
    const lastConnector = getLastConnector();
    if (!lastConnector)
      return false;
    const connected = await connectAsync({
      connector: lastConnector
    })
      .catch(() => false);
    updateCurrentUser({ connected: !!connected });
    return !!connected;
  }

  async function disconnect () {
    const lastConnector = getLastConnector();
    if (lastConnector)
      await disconnectAsync({
        connector: lastConnector
      });
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
      const isChainEqualToConnected = +account?.chainId === +chainToConnect?.chainId;
      const daoProps = isChainEqualToConnected ?
        { provider: await account?.connector?.getProvider() as Provider } :
        { web3Host: chainToConnect?.chainRpc };
      const dao = !daoService || !isSameChain || needsToUpdateConnection || !isSameRegistryAddress ?
        new DAO({
          ...daoProps,
          registryAddress: registryToLoad
        }) : daoService;
      if (!isChainEqualToConnected)
        await dao.start();
      else {
        dao.web3Connection.web3.givenProvider = await account?.connector?.getProvider() as Provider;
        dao.web3Connection.web3.eth.givenProvider = await account?.connector?.getProvider() as Provider;
      }
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
    start,
    connect,
    disconnect,
    updateChain,
  };
}