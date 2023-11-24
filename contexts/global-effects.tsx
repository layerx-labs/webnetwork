import {createContext, useEffect} from "react";

import {useDaoStore} from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import {useAuthentication} from "x-hooks/use-authentication";
import {useDao} from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import useSupportedChain from "x-hooks/use-supported-chain";

const _context = {};

export const GlobalEffectsContext = createContext(_context);
export const GlobalEffectsProvider = ({children}) => {

  const dao = useDao();
  const { currentUser } = useUserStore();
  const auth = useAuthentication();
  const { service: daoService } = useDaoStore();
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

  useEffect(auth.verifyReAuthorizationNeed, [currentUser?.walletAddress]);

  return <GlobalEffectsContext.Provider value={_context} children={children} />
}
