import { useState } from "react";

import { User } from "interfaces/api";

import { AddDistributionParticipantButtonView } from "./add-distribution-participant-button.view";

interface AddDistributionParticipantButtonProps {
  users: User[];
  onAddParticipant: (user: User) => void;
}

export function AddDistributionParticipantButton({
  users,
  onAddParticipant
}: AddDistributionParticipantButtonProps) {
  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const onAddClick = () => setIsSelectVisible(true);
  const onCancelClick = () => setIsSelectVisible(false);

  function onUserSelect(user: User) {
    onCancelClick();
    onAddParticipant(user);
  }

  return(
    <AddDistributionParticipantButtonView
      users={users}
      isSelectVisible={isSelectVisible}
      onAddClick={onAddClick}
      onCancelClick={onCancelClick}
      onUserSelect={onUserSelect}
    />
  );
}