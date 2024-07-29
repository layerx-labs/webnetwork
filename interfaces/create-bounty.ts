import { OriginLinkErrors } from "./enums/Errors";

export interface BountyDetailsSectionProps {
  title: string;
  updateTitle: (e: string) => void;
  description: string;
  updateDescription: (e: string) => void;
  selectedTags: string[];
  updateSelectedTags: (e: string[]) => void;
  isKyc: boolean;
  privateDeliverable: boolean;
  originLink: string;
  deliverableType: string;
  originLinkError?: OriginLinkErrors;
  multipleWinners: boolean;
  onOriginLinkChange: (link: string) => void;
  updateIsKyc: (e: boolean) => void;
  handlePrivateDeliverableChecked: (e: boolean) => void;
  updateTierList: (e: number[]) => void;
  setDeliverableType: (type: string) => void;
  onMultipleWinnersChange: (value: boolean) => void;
}
export interface BountyPayload {
  title: string;
  cid: string | boolean;
  transactional: string;
  tokenAmount: string;
  rewardToken?: string;
  rewardAmount?: string;
  fundingAmount?: string;
}
