import { IssueData } from "interfaces/issue-data";
import { LeaderBoard } from "interfaces/leaderboard";

export interface SearchBountiesPaginated {
  count: number;
  rows: IssueData[];
  currentPage: number;
  pages: number;
  totalBounties: number;
}

export interface PaginatedData<T> {
  count: number;
  rows: T[];
  currentPage: number;
  pages: number;
}

export type LeaderBoardPaginated = PaginatedData<LeaderBoard>;