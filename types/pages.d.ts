import { IssueData } from "interfaces/issue-data";
import { Proposal } from "interfaces/proposal";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

import { 
  SearchBountiesPaginated,
  LeaderBoardPaginated,
  CuratorsListPaginated,
  NetworkPaymentsData,
  ActiveMarketplace
} from "types/api";

export interface ExplorePageProps {
  numberOfNetworks: number;
  bounties: SearchBountiesPaginated;
  recentBounties: IssueData[];
  recentFunding: IssueData[];
  activeNetworks: ActiveMarketplace[];
}

export interface NetworkCuratorsPageProps {
  bounties: SearchBountiesPaginated;
  curators: CuratorsListPaginated;
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

interface ProfilePageProps {
  bounties?: SearchBountiesPaginated;
  payments?: NetworkPaymentsData[];
  chains?: SupportedChainData[];
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