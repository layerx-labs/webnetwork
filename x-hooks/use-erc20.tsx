import {useEffect, useState} from "react";

import {TransactionReceipt} from "@taikai/dappkit/dist/src/interfaces/web3-core";
import BigNumber from "bignumber.js";

import {useAppState} from "contexts/app-state";

import {UNSUPPORTED_CHAIN} from "helpers/constants";
import {parseTransaction} from "helpers/transactions";

import {MetamaskErrors} from "interfaces/enums/Errors";
import {TransactionStatus} from "interfaces/enums/transaction-status";
import {TransactionTypes} from "interfaces/enums/transaction-types";
import {SimpleBlockTransactionPayload} from "interfaces/transaction";

import useBepro from "x-hooks/use-bepro";
import {transactionStore} from "./stores/transaction-list/transaction.store";

export interface useERC20 {
  name: string;
  symbol: string;
  minimum: string;
  balance: BigNumber;
  address: string;
  decimals: number;
  loadError: boolean;
  allowance: BigNumber;
  totalSupply: BigNumber;
  approve: (amount: string) => Promise<{ balance: BigNumber, allowance: BigNumber }>;
  setAddress: (_address: string) => void;
  setSpender: (_address: string) => void;
  deploy: (name: string, symbol: string, cap: string, ownerAddress: string) => Promise<TransactionReceipt>;
  updateAllowanceAndBalance: () => Promise<{ balance: BigNumber, allowance: BigNumber }>;
}

export default function useERC20() {
  const [name, setName] = useState<string>();
  const [decimals, setDecimals] = useState(18);
  const [symbol, setSymbol] = useState<string>();
  const [minimum, setMinimum] = useState<string>();
  const [spender, setSpender] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState(BigNumber(0));
  const [loadError, setLoadError] = useState<boolean>();
  const [allowance, setAllowance] = useState(BigNumber(0));
  const [totalSupply, setTotalSupply] = useState(BigNumber(0));

  const { state } = useAppState();
  const {add: addTx, update: updateTx} = transactionStore();
  const { handleApproveToken, getERC20TokenData, getTokenBalance, getAllowance, deployERC20Token } = useBepro();

  const logData = { 
    wallet: state.currentUser?.walletAddress,
    token: address, 
    network: state.Service?.active?.network?.contractAddress,
    service: state.Service?.active
  };

  const isServiceReady = !state.Service?.starting && state.Service?.active;

  async function updateAllowanceAndBalance() {
    if (!state.currentUser?.walletAddress ||
        !address ||
        !name ||
        !isServiceReady ||
        state.connectedChain?.name === UNSUPPORTED_CHAIN) return;

    const balance = await getTokenBalance(address, state.currentUser.walletAddress)
      .then(b => {
        setBalance(b);
        return b;
      })
      .catch(error => {
        console.debug("useERC20:getTokenBalance", logData, error);
        return BigNumber(0);
      });

    const realSpender = spender || state.Service?.active?.network?.contractAddress;

    let allowance = BigNumber(0);
    if (realSpender)
      allowance = await getAllowance(address, state.currentUser.walletAddress, realSpender)
        .then(a => {
          setAllowance(a);
          return a;
        })
        .catch(error => {
          console.debug("useERC20:getAllowance", logData, error)
          return BigNumber(0)
        });

    return {balance, allowance}
  }

  function approve(amount: string) {
    if (!state.currentUser?.walletAddress || !state.Service?.active || !address || !amount) return;

    return handleApproveToken(address, amount, undefined, symbol).then(updateAllowanceAndBalance);
  }

  function setDefaults(newAddress?: string) {
    setAddress(newAddress);
    setName("");
    setSymbol("");
    setMinimum("");
    setDecimals(18);
    setTotalSupply(BigNumber(0));
    setBalance(BigNumber(0));
    setAllowance(BigNumber(0));
  }

  useEffect(() => {
    if (!address) {
      setLoadError(undefined);
      
      if (name)
        setDefaults();
    } else if (address && !name && isServiceReady && state.connectedChain?.matchWithNetworkChain !== false)
      getERC20TokenData(address)
        .then(async ({ name, symbol, decimals, totalSupply }) => {
          setName(name);
          setSymbol(symbol);
          setDecimals(decimals);
          setTotalSupply(totalSupply);
          setMinimum(minimum);
          setLoadError(false);
        })
        .catch(error => console.debug("useERC20:getERC20TokenData", logData, error));
  }, [
    state.currentUser?.walletAddress, 
    state.Service?.active, 
    address, 
    name, 
    isServiceReady, 
    state.connectedChain?.matchWithNetworkChain
  ]);

  useEffect(() => {
    updateAllowanceAndBalance();
  }, [state.currentUser?.walletAddress, isServiceReady, state.connectedChain, name]);

  async function deploy(name: string,
                        symbol: string,
                        cap: string,
                        ownerAddress: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.deployERC20Token,
        network: state.Service?.network?.active
      });

      await deployERC20Token(name, symbol, cap, ownerAddress)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err) => {
          updateTx({
            ...transaction,
            status: err?.code === MetamaskErrors.UserRejected ? TransactionStatus.rejected : TransactionStatus.failed,
          } as SimpleBlockTransactionPayload);
          reject(err);
        });
    });
  }

  function _setAddress(_address: string) {
    if (_address?.toLowerCase() !== address?.toLowerCase())
      setDefaults(_address);
  }

  function _setSpender(_address: string) {
    if (_address?.toLowerCase() !== address?.toLowerCase())
      setSpender(_address);
  }

  const ERC20data: useERC20 = {
    name,
    symbol,
    minimum,
    balance,
    address,
    decimals,
    loadError,
    allowance,
    totalSupply,
    approve,
    setAddress: _setAddress,
    setSpender: _setSpender,
    deploy,
    updateAllowanceAndBalance
  }

  return ERC20data
}
