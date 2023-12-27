import {Balance} from "interfaces/balance-state";
import {MatchAccountsStatus} from "interfaces/enums/api";
import {IssueBigNumberData, IssueDataComment} from "interfaces/issue-data";
import {kycSession} from "interfaces/kyc-session";

import { Tier} from "types/settings";

export interface ConnectedChain {
  id: string;
  name: string;
  shortName: string;
  explorer?: string;
  events?: string;
  registry?: string;
  matchWithNetworkChain?: boolean;
  lockAmountForNetworkCreation?: string;
  networkCreationFeePercentage?: number;
  closeFeePercentage?: number;
  cancelFeePercentage?: number;
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
  isCouncil?: boolean;
  notifications?: boolean;
  isGovernor?: boolean;
  language?: string;
}

export interface CurrentBounty {
  comments: IssueDataComment[];
  lastUpdated: number;
  kycSteps?: Tier[];
  data: IssueBigNumberData;
}