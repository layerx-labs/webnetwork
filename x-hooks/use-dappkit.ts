import { useCallback, useEffect, useState } from "react";

import { Web3Connection } from "@taikai/dappkit";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import type { provider as Provider } from "web3-core";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

type UseDappkit = {
  setProvider(p: Provider): void,
  setConnection(connection: Web3Connection): void,
  disconnect(): void,
  provider: Provider | null,
  connection: Web3Connection | null
}

export const [metamaskWallet, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({actions}));

export const useDappkit = create<UseDappkit>((set, get) => ({
  setProvider: (provider: Provider) => set(() => ({provider, connection: null})),
  setConnection: (connection: Web3Connection) => set(() => ({ connection })),
  disconnect: () => {
    if (!get().provider)
      return;
    if (get().provider?.hasOwnProperty("disconnect"))
      (get().provider as any)?.disconnect();

    set(() => ({connection: null, provider: null}))
  },
  provider: null,
  connection: null,
}));

export const useDappkitConnection = () =>
  useDappkit(useShallow(({connection}) => ({connection})));

export const useDappkitConnectionInfo = () => {
  const [chainId, setChainId] = useState(0);
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState<boolean>(false);
  const {connection} = useDappkitConnection();

  const connect = useCallback(async () => {
    if (!connection) {
      setAddress("");
      setChainId(0);
      setConnected(false);
      return;
    }
    const _address = await connection.getAddress();
    setChainId(await connection.getETHNetworkId())
    setAddress(_address);
    setConnected(!!_address);
  }, [connection])

  useEffect(() => { connect() }, [connection])

  return {chainId, address, connected}
}