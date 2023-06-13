import { IssueBigNumberData } from "interfaces/issue-data";

import { SearchBountiesPaginated } from "types/api";
import { BreakpointOptions } from "types/utils";

export interface SearchBountiesPaginatedBigNumber extends Omit<SearchBountiesPaginated, "rows"> {
  rows: IssueBigNumberData[];
}

export interface ResponsiveListItemColumnProps {
  label?: string;
  secondaryLabel?: string;
  breakpoints?: BreakpointOptions;
  currency?: string;
}