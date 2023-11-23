import {createContext, useEffect} from "react";

import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

import {useAppState} from "contexts/app-state";

import {useDaoStore} from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
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
  const { state } = useAppState();
  const { currentUser } = useUserStore();
  const auth = useAuthentication();
  const { service: daoService } = useDaoStore();
  const transactions = useStorageTransactions();
  const marketplace = useMarketplace();
  const { supportedChains, connectedChain } = useSupportedChain();

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
  useEffect(auth.updateKycSession, [currentUser?.accessToken,
                                    currentUser?.match,
                                    currentUser?.walletAddress,
                                    state?.Settings?.kyc?.tierList]);
  useEffect(auth.verifyReAuthorizationNeed, [currentUser?.walletAddress]);
  useEffect(() => {
    auth.syncUserDataWithSession();
  }, [daoService, session]);

  useEffect(settings.loadSettings, []);

  return <GlobalEffectsContext.Provider value={_context} children={children} />
}
