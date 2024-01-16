import EditIcon from "assets/icons/transactions/edit";

import Translation from "components/translation";

import PageActionsButton from "../action-button/view";

export default function EditBountyButton({ onClick }: { onClick: () => void }) {
  return (
    <PageActionsButton
      className="read-only-button bounty-outline-button me-1"
      onClick={onClick}
      dataTestId="edit-bounty-btn"
    >
      <>
        <EditIcon className="me-1" />
        <Translation ns="bounty" label="actions.edit-bounty" />
      </>
    </PageActionsButton>
  );
}
