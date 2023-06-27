import React, { ReactElement } from "react";
import { NumberFormatValues } from "react-number-format";

import { Wallet } from "interfaces/authentication";
import { TransactionTypes } from "interfaces/enums/transaction-types";

interface Info {
  title: string;
  description: string;
  label: string;
  caption: ReactElement;
  body: string;
  params: (from?: string) => { tokenAmount: string; from?: string };
}

export interface OraclesActionsViewProps {
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
  networkTxRef: React.MutableRefObject<HTMLButtonElement>;
  show: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
}

export interface OraclesActionsProps {
  wallet: Wallet;
  updateWalletBalance: () => void;
}

export interface ModalOraclesActionViewProps {
    renderInfo: Info;
    show: boolean;
    handleCancel: () => void;
    handleConfirm: () => void;
}
