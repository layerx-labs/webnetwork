import { useTranslation } from "next-i18next";

import ContractButton from "components/contract-button";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

export default function CancelButton({
  withLockIcon,
  isLoading,
  disabled,
  onClick,
}: {
  withLockIcon?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { t } = useTranslation(["pull-request"]);

  return (
    <ReadOnlyButtonWrapper>
      <ContractButton
        className="read-only-button text-nowrap"
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        withLockIcon={withLockIcon}
      >
        {t("actions.cancel")}
      </ContractButton>
    </ReadOnlyButtonWrapper>
  );
}
