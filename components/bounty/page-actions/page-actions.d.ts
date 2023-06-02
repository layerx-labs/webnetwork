import { CurrentUserState } from "interfaces/application-state";
import { IssueBigNumberData } from "interfaces/issue-data";

export interface PageActionsViewProps {
  handleEditIssue: () => void;
  handlePullrequest: (arg: {
    title: string;
    description: string;
    branch: string;
  }) => Promise<void>;
  handleStartWorking: () => Promise<void>;
  currentUser: CurrentUserState;
  bounty: IssueBigNumberData;
  isWalletConnected: boolean;
  isGithubConnected: boolean;
  isCreatePr: boolean;
  isCreateProposal: boolean;
  isExecuting: boolean;
  showPRModal: boolean;
  handleShowPRModal: (v: boolean) => void;
  ghVisibility: boolean;
  handleClickKyc: () => void;
  isUpdateAmountButton: boolean;
  isStartWorkingButton: boolean;
  isKycButton: boolean;
  isForkRepositoryLink: boolean;
  isEditButton: boolean;
}

export interface PageActionsControllerProps {
  isRepoForked?: boolean;
  addNewComment?: (comment: string) => void;
  handleEditIssue?: () => void;
  isEditIssue?: boolean;
}
