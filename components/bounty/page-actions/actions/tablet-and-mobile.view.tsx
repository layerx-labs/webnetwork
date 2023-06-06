import MultiActionButton, { Action } from "components/common/buttons/multi-action/view";
import ConnectGithub from "components/connect-github";

import StartWorkingButton from "./start-working.view";

interface TabletAndMobileButtonProps {
  isCreatePr: boolean;
  isCreateProposal: boolean;
  isExecuting: boolean;
  isConnectGithub: boolean;
  handleActionWorking: () => void;
  handleShowPRModal: (b: boolean) => void;
  handleShowPRProposal: (b: boolean) => void;
}

export default function TabletAndMobileButton({
  isCreatePr,
  isCreateProposal,
  isExecuting,
  isConnectGithub,
  handleActionWorking,
  handleShowPRModal,
  handleShowPRProposal,
}: TabletAndMobileButtonProps) {
  const actions: Action[] = [];

  if (isCreatePr)
    actions.push({
      label: "Pull Request",
      onClick: () => handleShowPRModal(true),
    });

  if (isCreateProposal)
    actions.push({
      label: "Proposal",
      onClick: () => handleShowPRProposal(true),
    });

  if (isConnectGithub)
    return <ConnectGithub size="lg" />;

  if (isCreatePr || isCreateProposal)
    return (
      <MultiActionButton label="Create" className="col-12" actions={actions} />
    );

  return (
    <StartWorkingButton
      onClick={handleActionWorking}
      isExecuting={isExecuting}
    />
  );
}
