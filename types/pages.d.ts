import {Curator} from "interfaces/curators";
import {Proposal} from "interfaces/proposal";
import {SupportedChainData} from "interfaces/supported-chain-data";
import {Token} from "interfaces/token";

import {
  LeaderBoardPaginated,
  NetworkPaymentsData,
  PaginatedCuratorOverview,
  PaginatedData,
  SearchBountiesPaginated
} from "types/api";

import {PointEventAction} from "./point-event-action";

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

export type PointsHistory = {
  actionName: PointEventAction,
  pointsWon: number,
  pointsCounted: boolean,
  info: any,
  updatedAt: Date,
}[]

interface DashboardPageProps {
  bounties?: SearchBountiesPaginated;
  payments?: NetworkPaymentsData[];
  chains?: SupportedChainData[];
  curators?: PaginatedData<Curator>;
  "my-points": {
    history: PointsHistory
  }
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