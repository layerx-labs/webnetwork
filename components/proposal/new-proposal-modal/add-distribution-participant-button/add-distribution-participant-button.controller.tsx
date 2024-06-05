import { useState } from "react";

import CloseIcon from "assets/icons/close-icon";
import PlusIcon from "assets/icons/plus-icon";

import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import { UserDropdown } from "components/dropdowns/user-dropdown/user-dropdown.controller";
import If from "components/If";

import { User } from "interfaces/api";


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

  const action = !isSelectVisible ? { 
    onClick: onAddClick, 
    icon: <PlusIcon width={16} height={16} />,
    tip: "Add participant",
  } : {
    onClick: onCancelClick, 
    icon: <CloseIcon width={16} height={16} />,
    tip: "Cancel",
  };

  function onUserSelect(user: User) {
    onCancelClick();
    onAddParticipant(user);
  }
  
  return(
    <div className="d-flex align-items-center gap-2 justify-content-end w-100">
      <If condition={isSelectVisible}>
        <div className="d-flex flex-column w-100">
          <UserDropdown
            selectedUser={null}
            users={users}
            onChange={onUserSelect}
          />
        </div>
      </If>

      <Tooltip tip={action.tip}>
        <div>
          <Button
            onClick={action.onClick}
            color="gray-800"
            textClass="text-gray-50"
            className="border-radius-4 p-1 border-gray-700 not-svg"
            data-testid="copy-button"
          >
            {action.icon}
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}