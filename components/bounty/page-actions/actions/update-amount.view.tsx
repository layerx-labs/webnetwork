import Translation from "components/translation";

import PageActionsButton from "../action-button/view";

export default function UpdateAmountButton({ onClick }: { onClick: () => void }) {
  return (
    <PageActionsButton
      className="read-only-button bounty-outline-button me-1"
      onClick={onClick}
      data-test-id="update-amount-btn"
    >
      <Translation ns="bounty" label="actions.update-amount" />
    </PageActionsButton>
  );
}
