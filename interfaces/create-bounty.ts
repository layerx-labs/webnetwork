import { IFilesProps } from "components/drag-and-drop";

export interface Repository {
  id: string; 
  path: string;
}

export interface Branch {
  value: string;
  label: string;
}

export interface BountyDetailsSectionProps {
  title: string;
  updateTitle: (e: string) => void;
  description: string;
  updateDescription: (e: string) => void;
  files: IFilesProps[];
  updateFiles: (files: IFilesProps[]) => void;
  selectedTags: string[];
  updateSelectedTags: (e: string[]) => void;
  isKyc: boolean;
  originLink: string;
  isOriginLinkBanned?: boolean;
  onOriginLinkChange: (link: string) => void;
  updateIsKyc: (e: boolean) => void;
  updateTierList: (e: number[]) => void;
  updateUploading: (e: boolean) => void;
  setDeliverableType: (type: string) => void;
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
