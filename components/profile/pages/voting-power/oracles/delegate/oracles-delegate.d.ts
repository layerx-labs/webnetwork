import {ChangeEvent} from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";

import { Wallet } from "interfaces/authentication";

export interface OraclesDelegateViewProps {
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
    wallet: Wallet;
    updateWalletBalance: () => void;
    defaultAddress?: string;
}