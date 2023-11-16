import { ReactElement } from "react";

import BigNumber from "bignumber.js";

import { Network } from "../interfaces/network";

export type TokenType = 'reward' | 'transactional';

export type CurrencysType = 'usd' | 'btc' | 'eth' | 'eur';

export interface Token {
  id?: number;
  chain_id?: number;
  address: string;
  name: string;
  symbol: string;
  networks?: Network[];
  currentValue?: number | string;
  tokenInfo?: TokenInfo;
  balance?: string | BigNumber;
  totalSupply?: BigNumber;
  decimals?: number;
  isTransactional?: boolean;
  network_tokens?: NetworkToken;
  isAllowed?: boolean;
  isReward?: boolean;
  minimum?: string;
  icon?: string | ReactElement;
}

export interface NetworkToken {
  id: number;
  networkId: number;
  tokenId: number;
  isTransactional: boolean;
  isReward: boolean;
}

export interface TokenInfo extends Partial<Token> {
    prices: TokenPrice;
}

export type TokenPrice = {
  [key in CurrencysType]?: number;
} & { updatedAt: string };