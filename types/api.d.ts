import { Curator } from "interfaces/curators";
import { Deliverable, IssueData } from "interfaces/issue-data";
import { LeaderBoard } from "interfaces/leaderboard";
import { Network, ThemeColors } from "interfaces/network";
import { Payment } from "interfaces/payments";
import { Proposal } from "interfaces/proposal";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

export type DatabaseId = number;
export interface PaginatedData<T> {
  count: number;
  rows: T[];
  currentPage: number;
  pages: number;
}

export interface SearchBountiesPaginated extends PaginatedData<IssueData> {
  totalBounties?: number;
}

export type LeaderBoardPaginated = PaginatedData<LeaderBoard>;

export interface CuratorsListPaginated extends PaginatedData<Curator> {
  totalCurators: number;
}

export type DeliverablePaginatedData = PaginatedData<Deliverable>;

export type ProposalPaginatedData = PaginatedData<Proposal>;

export interface NetworkOverviewData {
  name: string;
  networkAddress: string;
  bounties: {
    draft?: number;
    open?: number;
    ready?: number;
    proposal?: number;
    canceled?: number;
    closed?: number;
  };
  curators: {
    total: number;
    tokensLocked: number;
  };
  networkTokenOnClosedBounties: number;
  members: number;
}

export type PaymentsData = Payment[];

export interface NetworkPaymentsData extends Partial<Network> {
  payments?: PaymentsData;
}

export interface UpdateBountyVisibilityParams {
  id: string | number;
  visible: boolean;
  networkAddress: string;
}

export interface CreateNetworkParams {
  name: string;
  description: string;
  colors: ThemeColors;
  logoIcon: string;
  fullLogo: string;
  creator: string;
  tokens: {
    settler: string;
    allowedTransactions: Token[];
    allowedRewards: Token[];
  };
  networkAddress: string;
  signedMessage: string;
}

export interface UpdateNetworkParams {
  description?: string;
  colors?: ThemeColors;
  logoIcon?: string;
  fullLogo?: string;
  creator: string;
  isClosed?: boolean;
  networkAddress: string;
}

export interface ActiveMarketplace {
  name: string;
  fullLogo?: string;
  logoIcon?: string;
  totalValueLock: string;
  totalIssues: number;
  chains: Partial<SupportedChainData>[];
  hasNotConverted?: boolean;
}

export type ActiveNetworksPaginated = PaginatedData<ActiveMarketplace>;

export interface CuratorOverview {
  address: string;
  acceptedProposals: number;
  disputedProposals: number;
  disputes: number;
  totalVotes: number;
  marketplaces: Pick<Network, "networkAddress" | "name" | "chain">[];
}

export interface PaginatedCuratorOverview extends PaginatedData<CuratorOverview> {
  totalCurators: number;
}

export interface ConvertedAmountsOverview {
  totalOnTasks: number;
}