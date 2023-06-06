import { isMobile, isTablet } from "react-device-detect";

import Translation from "components/translation";

import PageActionsButton from "../action-button/view";


export default function StartWorkingButton({
    onClick,
    isExecuting = false
}: {
    onClick: () => void;
    isExecuting?: boolean;
}) {
  return (
    <PageActionsButton
      onClick={onClick}
      className={`d-none d-lg-block read-only-button ${
        isTablet || isMobile ? "col-12" : "bounty-outline-button"
      }`}
      disabled={isExecuting}
      isLoading={isExecuting}
    >
      <span>
        <Translation ns="bounty" label="actions.start-working.title" />
      </span>
    </PageActionsButton>
  );
}
