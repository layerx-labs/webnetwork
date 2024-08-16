import { ChangeEvent, MutableRefObject, ReactElement } from "react";
import { NumberFormatValues } from "react-number-format";

import { OraclesResume, Delegation } from "@taikai/dappkit";
import BigNumber from "bignumber.js";

import { Wallet } from "./authentication";
import { TransactionTypes } from "./enums/transaction-types";

export interface DelegationExtended extends Delegation {
  id: number;
  from: string;
  to: string;
  amount: BigNumber;
}

export interface OraclesResumeExtended extends OraclesResume {
  locked: BigNumber;
  delegatedToOthers: BigNumber;
  delegatedByOthers: BigNumber;
  delegations: DelegationExtended[];
}

export interface OracleToken {
  symbol: string;
  name: string;
  icon: ReactElement;
}

interface Info {
  title: string;
  description: string;
  label: string;
  caption: ReactElement;
  body: string;
  params: (from?: string) => { tokenAmount: string; from?: string };
}

export interface OraclesActionsViewProps {
  disabled?: boolean;
  isBalanceLoading?: boolean;
  wallet: Wallet;
  actions: string[];
  action: string;
  handleAction: (v: string) => void;
  renderInfo: Info;
  currentLabel: string;
  networkTokenSymbol: string;
  error: string;
  tokenAmount: string;
  handleChangeToken: (v: NumberFormatValues) => void;
  networkTokenDecimals: number;
  getMaxAmount: (trueValue?: boolean) => string;
  handleMaxAmount: () => void;
  needsApproval: boolean;
  isApproving: boolean;
  approveSettlerToken: () => void;
  verifyTransactionState: (type: TransactionTypes) => boolean;
  isButtonDisabled: boolean;
  handleCheck: () => void;
  txType: TransactionTypes.lock | TransactionTypes.unlock;
  handleProcessEvent: (blockNumber: string | number) => void;
  onSuccess: () => void;
  handleError: (m?: string) => void;
  networkTxRef: MutableRefObject<HTMLButtonElement>;
  show: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

export interface OraclesActionsProps {
  disabled?: boolean;
  isBalanceLoading?: boolean;
  wallet: Wallet;
  updateWalletBalance: () => void;
}

export interface ModalOraclesActionViewProps {
    renderInfo: Info;
    show: boolean;
    handleCancel: () => void;
    handleConfirm: () => void;
}

export interface OraclesDelegateViewProps {
  isBalanceLoading?: boolean;
  disabled?: boolean;
  tokenAmount: string
  handleChangeOracles: (params: NumberFormatValues) => void;
  error: string;
  networkTokenDecimals: number;
  availableAmount: BigNumber;
  handleMaxAmount: () => void;
  delegatedTo: string;
  handleChangeAddress: (params: ChangeEvent<HTMLInputElement>) => void;
  isAddressesEqual: boolean;
  addressError: string;
  networkTokenSymbol: string;
  handleClickVerification: () => void;
  handleProcessEvent: (blockNumber: number | string) => void;
  handleTransition: () => void;
  handleError: (m?: string) => void; 
  isButtonDisabled: boolean;
}

export interface OraclesDelegateProps {
  isBalanceLoading?: boolean;
  disabled?: boolean;
  wallet: Wallet;
  updateWalletBalance: () => void;
  defaultAddress?: string;
}