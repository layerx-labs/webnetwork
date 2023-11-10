import {Dispatch} from "react";

import { Web3Connection } from "@taikai/dappkit";

import {XReducerAction} from "contexts/reducers/reducer";

import {Balance} from "interfaces/balance-state";
import { MatchAccountsStatus } from "interfaces/enums/api";
import {IssueBigNumberData, IssueDataComment} from "interfaces/issue-data";
import {kycSession} from "interfaces/kyc-session";
import {LoadingState} from "interfaces/loading-state";
import {Network} from "interfaces/network";
import {SupportedChainData} from "interfaces/supported-chain-data";
import {Token} from "interfaces/token";
import {BlockTransaction, SimpleBlockTransactionPayload, UpdateBlockTransaction} from "interfaces/transaction";

import DAO from "services/dao-service";

import {SettingsType, Tier} from "types/settings";

export interface ServiceNetwork {
  lastVisited: string;
  active: Network | null;
  noDefaultNetwork?: boolean;
  availableChains?: SupportedChainData[];
  tokens: {transactional: Token[]; reward: Token[];} | null;
}

export interface ServiceState {
  starting: boolean;
  microReady: boolean | null;
  active: DAO | null;
  network: ServiceNetwork | null;
  web3Connection: Web3Connection
}

export interface ConnectedChain {
  id: string;
  name: string;
  shortName: string;
  explorer?: string;
  events?: string;
  registry?: string;
  matchWithNetworkChain?: boolean;
}

export interface CurrentUserState {
  walletAddress: string;
  match?: MatchAccountsStatus | undefined;
  balance?: Balance | null;
  login?: string;
  accessToken?: string;
  connected?: boolean;
  signature?: string;
  isAdmin?: boolean;
  hasRegisteredNetwork?: boolean;
  kyc?: kycSession;
  kycSession?: kycSession;
  id?: number;
}

export interface CurrentBounty {
  comments: IssueDataComment[];
  lastUpdated: number;
  kycSteps?: Tier[];
  data: IssueBigNumberData;
}

export interface State {
  Settings: SettingsType | null;
  Service: ServiceState | null,
  loading: LoadingState | null;
  transactions: (SimpleBlockTransactionPayload | BlockTransaction | UpdateBlockTransaction)[];
  currentUser: CurrentUserState | null,
  connectedChain: ConnectedChain | null,
  currentBounty: CurrentBounty | null,
  supportedChains: SupportedChainData[] | null,
  show: {
    [key: string]: boolean;
  }
}

export interface AppState {
  state: State,
  dispatch: (action: XReducerAction<any>) => Dispatch<XReducerAction<any>>;
}