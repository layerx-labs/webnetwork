export interface SearchLeaderBoard {
  page?: string;
  address?: string;
  sortBy?: string;
  order?: string;
  time?: string;
  search?: string;
}

export interface LeaderBoard {
  address: string;
  user?: {
    handle?: string;
    avatar?: string;
  };
  networkslogos?: string[];
  marketplacelogos?: string[];
  numberNfts?: number;
  ownedBountiesOpened?: number;
  ownedBountiesClosed?: number;
  ownedBountiesCanceled?: number;
  ownedProposalCreated?: number;
  ownedProposalAccepted?: number;
  ownedProposalRejected?: number;
}
