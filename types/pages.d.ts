import { IssueData } from "interfaces/issue-data";

export interface ExplorePageProps {
  numberOfNetworks: number;
  numberOfBounties: number;
  recentBounties: IssueData[];
  recentFunding: IssueData[];
}