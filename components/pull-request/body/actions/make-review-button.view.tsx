import { useTranslation } from "next-i18next";

import ContractButton from "components/contract-button";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

export default function MakeReviewButton({
  withLockIcon,
  isLoading,
  disabled,
  onClick,
  className
}: {
  withLockIcon?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const { t } = useTranslation(["common"]);

  return (
    <ReadOnlyButtonWrapper>
      <ContractButton
        className={`read-only-button text-nowrap ${className}`}
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        withLockIcon={withLockIcon}
      >
        {t("actions.make-a-review")}
      </ContractButton>
    </ReadOnlyButtonWrapper>
  );
}
