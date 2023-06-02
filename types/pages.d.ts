import { IssueData } from "interfaces/issue-data";

import { SearchBountiesPaginated } from "types/api";

export interface ExplorePageProps {
  numberOfNetworks: number;
  numberOfBounties: number;
  bounties: SearchBountiesPaginated;
  recentBounties: IssueData[];
  recentFunding: IssueData[];
}