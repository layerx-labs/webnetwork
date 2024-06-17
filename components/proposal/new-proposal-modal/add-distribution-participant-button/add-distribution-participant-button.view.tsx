import { useTranslation } from "next-i18next";

import CloseIcon from "assets/icons/close-icon";
import PlusIcon from "assets/icons/plus-icon";

import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import { UserDropdown } from "components/dropdowns/user-dropdown/user-dropdown.controller";
import If from "components/If";

import { User } from "interfaces/api";

interface AddDistributionParticipantButtonViewProps {
  users: User[];
  isSelectVisible: boolean;
  onAddClick: () => void;
  onCancelClick: () => void;
  onUserSelect: (user: User) => void;
}

export function AddDistributionParticipantButtonView({
  users,
  isSelectVisible,
  onAddClick,
  onCancelClick,
  onUserSelect,
}: AddDistributionParticipantButtonViewProps) {
  const { t } = useTranslation("proposal");

  const action = !isSelectVisible ? { 
    onClick: onAddClick, 
    icon: <PlusIcon width={16} height={16} />,
    tip: t("actions.add-participant"),
    testId: 'confirm-add-participant-button'
  } : {
    onClick: onCancelClick, 
    icon: <CloseIcon width={16} height={16} />,
    tip: t("actions.cancel"),
    testId: 'cancel-add-participant-button'
  };
  
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
            data-testid={action.testId}
          >
            {action.icon}
          </Button>
        </div>
      </Tooltip>
    </div>
  );
}