import {Spinner} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import PermissionInput from "../../../../common/inputs/permission-input/permission-input";
import PermissionListItem from "../../../../common/lists/permission-list/permission-list-item";
import If from "../../../../If";
import Translation from "../../../../translation";
import NetworkTabContainer from "../../tab-container/view";

type AllowListViewProps = {
  allowList: string[],
  value: string,
  isLoading?: boolean,
  onTrashClick(address: string): void,
  onValueChange(newValue: string): void,
  onAddClick(): void,
  error: "" | "not-address" | "already-exists",
}

export default function AllowListView({value, onValueChange, onAddClick, allowList, onTrashClick, error, isLoading}: AllowListViewProps) {
  const { t } = useTranslation(["custom-network"]);

  return <NetworkTabContainer>
    <div className="d-flex flex-column my-4">
      <span>
        <Translation ns="custom-network" label="steps.permissions.allow-list.title" />
      </span>
      <p className="mt-2 text-gray-200">
        <Translation ns="custom-network" label="steps.permissions.allow-list.description" />
      </p>
      <PermissionInput error={(value && error) && <Translation ns="custom-network"
                                                               label={`steps.permissions.allow-list.error.${error}`} />}
                       value={value}
                       placeholder={t("custom-network:steps.permissions.allow-list.place-holder")}
                       onChange={onValueChange}
                       onClickAdd={onAddClick} />
        <div className="d-flex flex-column mt-4">
          <If condition={!isLoading}
              children={allowList?.map((address, index) =>
                <PermissionListItem value={address} id={index} onTrashClick={onTrashClick} />)}
              otherwise={<div className="col-md-5 col-12 text-center"><Spinner animation={"border"} /></div>} />
        </div>
    </div>
  </NetworkTabContainer>
}