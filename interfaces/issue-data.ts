import BigNumber from "bignumber.js";

import { Network } from "interfaces/network";
import { Payment } from "interfaces/payments";
import { Proposal } from "interfaces/proposal";
import { SupportedChainData } from "interfaces/supported-chain-data";
import { Token } from "interfaces/token";

import { User } from "./api";

export type IssueState =
  | "pending"
  | "draft"
  | "open"
  | "in progress"
  | "canceled"
  | "closed"
  | "ready"
  | "done"
  | "disputed"
  | "funding"
  | "partial-funded"
  | "proposal";

export interface IssueData {
  id?: string; // database id
  amount?: string;
  fundingAmount?: string;
  fundedAmount?: string;
  rewardAmount?: string;
  developerAmount?: string;
  body: string;
  createdAt: Date;
  dueDate?: string;
  mergeProposals: Proposal[];
  merged: string;
  numberOfComments: number;
  owner?: string;
  network_id?: number;
  deliverables: Deliverable[];
  seoImage: string;
  nftImage?: string;
  state: IssueState;
  title: string;
  updatedAt?: Date;
  url?: string;
  contractId?: number;
  transactionalToken?: Token;
  rewardToken?: Token;
  working: string[];
  fundedAt?: Date;
  benefactors?: fundingBenefactor[];
  disputes?: Disputes[];
  payments: Payment[];
  network?: Network;
  chain?: SupportedChainData;
  tags: string[];
  isDraft: boolean;
  isClosed: boolean;
  isFundingRequest: boolean;
  isFunded: boolean;
  isCanceled: boolean;
  isReady?: boolean;
  hasReward?: boolean;
  fundedPercent: number;
  isKyc: boolean;
  visible: boolean;
  kycTierList: number[];
  contractCreationDate?: string;
  ipfsUrl?: string;
  type?: string;
  origin?: string;
  userId: number;
  user?: User;
  privateDeliverables?: boolean;
}

export interface Disputes {
  address: string;
  weight: number;
  issueId: number;
  proposalId: number;
}

export interface IssueBigNumberData 
  extends Omit<IssueData , "amount" | "fundingAmount" | "fundedAmount" | "rewardAmount" | "developerAmount" > {
  amount: BigNumber;
  developerAmount: BigNumber;
  fundingAmount: BigNumber;
  fundedAmount: BigNumber;
  rewardAmount: BigNumber;
}

export interface Deliverable {
  id: number;
  deliverableUrl: string;
  ipfsLink: string;
  title: string;
  description: string;
  canceled: boolean;
  markedReadyForReview: boolean;
  accepted: boolean;
  issueId: number;
  bountyId?: number;
  prContractId?: number;
  user?: User;
  comments?: IssueDataComment[];
  userId: number;
  isCancelable: boolean;
  createdAt: Date;
  updatedAt: Date;
  issue?: IssueData;
}

export interface IssueDataComment {
  id: number;
  comment: string;
  hidden: boolean;
  type: string;
  issueId: number;
  proposalId?: number;
  deliverableId?: number;
  userId: number;
  userAddress: string;
  replyId?: number;
  updatedAt: Date;
  createdAt: Date;
  user: User;
  replies?: IssueDataComment[];
  replied?: IssueDataComment;
}

export interface fundingBenefactor {
  amount: BigNumber;
  address: string;
  contractId: number;
  issueId: number;
  withdrawn?: boolean
}
