import {createContext, useEffect} from "react";

import {Web3Connection} from "@taikai/dappkit";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

import {useAppState} from "contexts/app-state";
import {changeWeb3Connection} from "contexts/reducers/change-service";

import {useDaoStore} from "x-hooks/stores/dao/dao.store";
import {useAuthentication} from "x-hooks/use-authentication";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import {useSettings} from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

import {useStorageTransactions} from "../x-hooks/use-storage-transactions";

const _context = {};

export const GlobalEffectsContext = createContext(_context);
export const GlobalEffectsProvider = ({children}) => {

  const {query} = useRouter();
  const session = useSession();

  const dao = useDao();
  const settings = useSettings();
  const auth = useAuthentication();
  const { service: daoService } = useDaoStore();
  const transactions = useStorageTransactions();
  const marketplace = useMarketplace();
  const { state, dispatch } = useAppState();
  const { supportedChains, connectedChain } = useSupportedChain();

  const { currentUser, Service } = state;

  useEffect(() => {
    const web3Connection = new Web3Connection({
      skipWindowAssignment: true
    });

    dispatch(changeWeb3Connection(web3Connection));
  }, []);

  useEffect(dao.listenChainChanged, [
    supportedChains
  ]);

  useEffect(() => {
    dao.start();
  }, [
    marketplace?.active?.chain_id,
    connectedChain?.id,
    connectedChain?.registry,
    currentUser?.connected
  ]);

  useEffect(() => {
    dao.changeNetwork();
  }, [
    daoService,
    marketplace?.active?.networkAddress,
    marketplace?.active?.chain_id,
  ]);

  useEffect(auth.updateWalletBalance, [currentUser?.walletAddress, daoService?.network?.contractAddress]);
  useEffect(auth.updateKycSession, [state?.currentUser?.accessToken,
                                    state?.currentUser?.match,
                                    state?.currentUser?.walletAddress,
                                    state?.Settings?.kyc?.tierList]);
  useEffect(auth.verifyReAuthorizationNeed, [currentUser?.walletAddress]);
  useEffect(() => {
    auth.syncUserDataWithSession();
  }, [daoService, session]);

  useEffect(settings.loadSettings, []);

  return <GlobalEffectsContext.Provider value={_context} children={children} />
}
