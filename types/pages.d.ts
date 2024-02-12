import {Curator} from "interfaces/curators";
import { IssueData } from "interfaces/issue-data";
import { Proposal } from "interfaces/proposal";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

import {
  SearchBountiesPaginated,
  LeaderBoardPaginated,
  NetworkPaymentsData,
  PaginatedCuratorOverview,
  PaginatedData
} from "types/api";

export interface ExplorePageProps {
  totalOnTasks: number;
  bounties: SearchBountiesPaginated;
  protocolMembers: number;
}

export interface NetworkCuratorsPageProps {
  bounties: SearchBountiesPaginated;
  curators: PaginatedCuratorOverview;
  totalReadyBounties: number;
  totalDistributed: number;
  totalLocked: number;
}

export interface LeaderBoardPageProps {
  leaderboard: LeaderBoardPaginated;
}

export interface ProposalPageProps {
  proposal: Proposal;
}

interface MyMarketplacePageProps {
  bounties: SearchBountiesPaginated;
}

interface DashboardPageProps {
  bounties?: SearchBountiesPaginated;
  payments?: NetworkPaymentsData[];
  chains?: SupportedChainData[];
  curators?: PaginatedData<Curator>;
}

export interface MyNetworkPageProps {
  bounties: SearchBountiesPaginated;
}

export interface PaymentsPageProps {
  payments: NetworkPaymentsData[];
  chains: SupportedChainData[];
}
export interface WalletPageProps {
  chains: SupportedChainData[];
  tokens: Token[];
}