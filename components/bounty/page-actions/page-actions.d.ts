import { CurrentUserState } from "interfaces/application-state";
import { IssueBigNumberData } from "interfaces/issue-data";

export interface PageActionsViewProps {
  isRepoForked: boolean;
  handleEditIssue: () => void;
  handlePullrequest: (arg: {
    title: string;
    description: string;
    branch: string;
  }) => Promise<void>;
  handleStartWorking: () => Promise<void>;
  isEditIssue: boolean;
  isKycEnabled: boolean;
  currentUser: CurrentUserState;
  bounty: IssueBigNumberData;
  isBountyInDraft: boolean;
  isWalletConnected: boolean;
  isKycVerified: boolean;
  isGithubConnected: boolean;
  isFundingRequest: boolean;
  isWorkingOnBounty: boolean;
  isBountyOpen: boolean;
  isStateToWorking: boolean;
  isBountyOwner: boolean;
  isCreatePr: boolean;
  isCreateProposal: boolean;
  isExecuting: boolean;
  showPRModal: boolean;
  handleShowPRModal: (v: boolean) => void;
  ghVisibility: boolean;
  handleClickKyc: () => void;
}

export interface PageActionsControllerProps {
  isRepoForked?: boolean;
  addNewComment?: (comment: string) => void;
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
}
