import { ChangeEvent } from "react";
import { NumberFormatValues } from "react-number-format";

import BigNumber from "bignumber.js";

import { Token } from "interfaces/token";

export interface RewardInformationViewProps {
  isFundingType: boolean;
  defaultValue: {
    value: string;
    formattedValue: string;
    floatValue: number;
  };
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
  updateRewardToken: (v: Token) => void;
  updateTransactionalToken: (v: Token) => void;
  addToken: (newToken: Token) => Promise<void>;
  handleRewardChecked: (v: ChangeEvent<HTMLInputElement>) => void;
  updateIssueAmount: (v: NumberFormatValues) => void;
  updateRewardAmount: (v: NumberFormatValues) => void;
  updateIsFunding: (v: boolean) => void;
}

export interface RewardInformationControllerProps {
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
  updateRewardToken: (v: Token) => void;
  updateTransactionalToken: (v: Token) => void;
  addToken: (newToken: Token) => Promise<void>;
  handleRewardChecked: (v: ChangeEvent<HTMLInputElement>) => void;
  updateIssueAmount: (v: NumberFormatValues) => void;
  updateRewardAmount: (v: NumberFormatValues) => void;
  updateIsFundingType: (v: boolean) => void;
}
