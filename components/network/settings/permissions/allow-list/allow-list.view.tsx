import { Spinner } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import PermissionInput from "components/common/inputs/permission-input/permission-input";
import PermissionListItem from "components/common/lists/permission-list/permission-list-item";
import If from "components/If";
import NetworkTabContainer from "components/network/settings/tab-container/view";
import Translation from "components/translation";

import { truncateAddress } from "helpers/truncate-address";

import { AllowListTypes } from "interfaces/enums/marketplace";

type AllowListViewProps = {
  allowList: string[],
  value: string,
  isLoading?: boolean,
  isAdding?: boolean,
  isRemoving?: boolean,
  onTrashClick (address: string): void,
  onValueChange (newValue: string): void,
  onAddClick (): void,
  error: "" | "not-address" | "already-exists",
  type: AllowListTypes
}

export default function AllowListView ({
  value,
  onValueChange,
  onAddClick,
  allowList,
  onTrashClick,
  error,
  isLoading,
  isAdding,
  isRemoving,
  type
}: AllowListViewProps) {
  const { t } = useTranslation(["custom-network"]);

  const errorMessage = (value && error) &&
    <Translation ns="custom-network" label={`steps.permissions.allow-list.error.${error}`}/>;

  return (
    <NetworkTabContainer>
      <div className="d-flex flex-column my-4">
        <span>
          <Translation ns="custom-network" label={`steps.permissions.allow-list.${type}-title`}/>
        </span>

        <p className="mt-2 text-gray-200">
          <Translation ns="custom-network" label={`steps.permissions.allow-list.${type}-description`}/>
        </p>

        <PermissionInput
          error={errorMessage}
          value={value}
          disabledButton={!value || !!error || isAdding || isRemoving}
          placeholder={t("custom-network:steps.permissions.allow-list.place-holder")}
          onChange={onValueChange}
          onClickAdd={onAddClick}
          isLoading={isAdding}
        />

        <div className="mt-4">
          <span className="mb-2 d-block">
            <Translation ns="custom-network" label="steps.permissions.allow-list.list-title"/>
          </span>

          <If
            condition={!isLoading}
            otherwise={
              <div className="col-md-5 col-12 text-center">
                <Spinner animation={"border"}/>
              </div>
            }
          >
            {
              allowList?.map((address, index) =>
                <PermissionListItem
                  key={`${type}-${address}`}
                  value={address}
                  label={truncateAddress(address, 10, 8)}
                  id={index}
                  onTrashClick={onTrashClick}
                  disabled={isRemoving}
                />)
            }
          </If>
        </div>
      </div>
    </NetworkTabContainer>
  );
}