import {useTranslation} from "next-i18next";

import PermissionInput from "components/common/inputs/permission-input/permission-input";
import PermissionListItem from "components/common/lists/permission-list/permission-list-item";
import {Divider} from "components/divider";
import NetworkTabContainer from "components/network/settings/tab-container/view";

interface BannedWordsViewProps {
  domain: string;
  domains: string[];
  isExecuting?: boolean;
  onChangeDomain: (v: string) => void;
  handleAddDomain: () => void;
  handleRemoveDomain: (v: string) => void;
}

export default function BannedWordsView({
  domain,
  domains,
  isExecuting,
  onChangeDomain,
  handleAddDomain,
  handleRemoveDomain,
}: BannedWordsViewProps) {
  const { t } = useTranslation(["custom-network"]);
  
  return (
    <NetworkTabContainer>
      <div className="d-flex flex-column my-4">
        <span>{t("steps.permissions.domains.title")}</span>
        <p className="mt-2 text-gray-200">
            {t("steps.permissions.domains.description")}
        </p>
        <PermissionInput
          value={domain}
          onChange={onChangeDomain}
          onClickAdd={handleAddDomain}
          placeholder={t("steps.permissions.domains.placeholder")}
          disabledButton={!domain || isExecuting}
          type="banned-word"
        />
        {domains?.length > 0 ? (
          <div className="d-flex flex-column mt-4">
            <span className="mb-4">{t("steps.permissions.domains.list")}</span>
            {domains.map((value, key) => (
              <PermissionListItem
                key={key}
                value={value}
                id={key}
                onTrashClick={handleRemoveDomain}
              />
            ))}
          </div>
        ) : null}
      </div>
      <Divider bg="gray-800" />
    </NetworkTabContainer>
  );
}
