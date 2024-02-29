import { ReactNode, ChangeEvent, SVGProps, ReactElement } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";

import { Currency } from "interfaces/currency";
import { IssueBigNumberData } from "interfaces/issue-data";
import { Network } from "interfaces/network";
import { DistributionsProps } from "interfaces/proposal";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";
import { ProfilePages } from "interfaces/utils";

import { SearchBountiesPaginated } from "types/api";
import { VisibilityOptions, Direction, SelectOption } from "types/utils";

export interface SearchBountiesPaginatedBigNumber extends Omit<SearchBountiesPaginated, "rows"> {
  rows: IssueBigNumberData[];
}

export interface ResponsiveListItemColumnProps {
  label?: string;
  secondaryLabel?: ReactNode;
  visibility?: VisibilityOptions;
  currency?: string;
  justify?: string;
}

export interface CopyButtonProps {
  value: string;
  title?: string;
  popOverLabel?: string;
}

export interface SortOption extends Omit<SelectOption, "value"> {
  value: string;
  sortBy: string;
  order: string;
}

export interface CustomDropdownItem {
  content: ReactNode;
  onClick?: () => void;
}

export interface HeroInfo {
  value: number | string;
  label: string;
  currency?: Currency;
  hasConvertedTokens?: boolean;
  setListedModalVisibility?: (visible: boolean) => void;
}

export interface MiniTabsItem {
  onClick: () => void;
  label: string;
  active: boolean;
}

export interface IntervalFiltersProps {
  defaultInterval?: number;
  intervals: number[];
  intervalIn?: "days" | "months" | "years";
  direction?: Direction;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
}

export interface ChainFilterProps {
  chains: SupportedChainData[];
  direction?: Direction;
  onChange?: (value: string | number) => void;
  label?: boolean;
}

export interface MarketplaceFilterProps {
  marketplaces: Network[];
  direction?: Direction;
  onChange?: (value: string | number) => void;
  label?: boolean;
}

export interface AmountCardProps {
  title: string;
  amount?: number;
  description: string;
  fixed?: number;
}
export interface RewardInformationViewProps {
  isFundingType: boolean;
  defaultValue: {
    value: string;
    formattedValue: string;
    floatValue: number;
  };
  currentNetwork: Network;
  currentUserWallet: string;
  rewardChecked: boolean;
  transactionalToken: Token;
  rewardToken: Token;
  bountyDecimals: number;
  rewardDecimals: number;
  issueAmount: NumberFormatValues;
  rewardAmount: NumberFormatValues;
  bountyTokens: Token[];
  rewardTokens: Token[];
  rewardBalance: BigNumber;
  bountyBalance: BigNumber;
  previewAmount: NumberFormatValues;
  distributions: DistributionsProps;
  updateRewardToken: (v: Token) => void;
  updateTransactionalToken: (v: Token) => void;
  addToken: (newToken: Token) => Promise<void>;
  handleRewardChecked: (v: ChangeEvent<HTMLInputElement>) => void;
  updateIssueAmount: (v: NumberFormatValues) => void;
  updateRewardAmount: (v: NumberFormatValues) => void;
  updateIsFunding: (v: boolean) => void;
  setPreviewAmount: (v: NumberFormatValues) => void;
  setDistributions: (v: DistributionsProps) => void;
}

export interface RewardInformationSectionProps {
  currentNetwork: Network;
  isFundingType: boolean;
  rewardChecked: boolean;
  transactionalToken: Token;
  rewardToken: Token;
  bountyDecimals: number;
  rewardDecimals: number;
  issueAmount: NumberFormatValues;
  rewardAmount: NumberFormatValues;
  bountyTokens: Token[];
  rewardTokens: Token[];
  rewardBalance: BigNumber;
  bountyBalance: BigNumber;
  previewAmount: NumberFormatValues;
  distributions: DistributionsProps;
  updateRewardToken: (v: Token) => void;
  updateTransactionalToken: (v: Token) => void;
  addToken: (newToken: Token) => Promise<void>;
  handleRewardChecked: (v: ChangeEvent<HTMLInputElement>) => void;
  updateIssueAmount: (v: NumberFormatValues) => void;
  updateRewardAmount: (v: NumberFormatValues) => void;
  updateIsFundingType: (v: boolean) => void;
  setPreviewAmount: (v: NumberFormatValues) => void;
  setDistributions: (v: DistributionsProps) => void;
}

export interface LinkProps {
  label: string;
  href?: ProfilePages;
  icon?: (props?: SVGProps<SVGSVGElement>) => ReactElement
}

export interface PaymentInfoProps {
  address: string;
  login: string;
  amount: string;
  symbol: string;
  percentage: string;
  label: string;
}

export type DeliverableButtonType = "cancel" | "review" | "ready-review"

export type TasksListItemVariant = "small" | "network" | "multi-network" | "management" | "submissions" | "proposals";

export interface TaskListItemVariantProps {
  task: IssueBigNumberData;
  onClick?: () => void;
}

export type Status = "review" | "not-accepted" | "canceled" | "accepted" | "draft" | "refused" | "disputed";

export type HeaderColumn = {
  label: string,
  tip?: string,
}