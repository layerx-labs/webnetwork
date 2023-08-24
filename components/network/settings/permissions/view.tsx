import { useTranslation } from "next-i18next";

import { Divider } from "components/divider";

import NetworkTabContainer from "../tab-container/view";
import PermissionInput from "./input/view";
import PermissionsItem from "./item/view";

interface NetworkPermissionsViewProps {
  domain: string;
  domains: string[];
  onChangeDomain: (v: string) => void;
  handleAddDomain: () => void;
}

export default function NetworkPermissionsView({
  domain,
  domains,
  onChangeDomain,
  handleAddDomain,
}: NetworkPermissionsViewProps) {
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
        />
        {domains?.length > 0 ? (
          <div className="d-flex flex-column mt-4">
            <span className="mb-4">{t("steps.permissions.domains.list")}</span>
            {domains.map((value, key) => (
              <PermissionsItem
                value={value}
                id={key}
                onTrashClick={(id: number) => console.log(id)}
              />
            ))}
          </div>
        ) : null}
      </div>
      <Divider bg="gray-800" />
    </NetworkTabContainer>
  );
}
