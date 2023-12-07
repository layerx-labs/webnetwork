import { useTranslation } from "next-i18next";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

import {DeliverableButtonType} from "types/components";

export default function DeliverableButton({
  withLockIcon,
  isLoading,
  disabled,
  onClick,
  className,
  type
}: {
  withLockIcon?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => Promise<void>;
  className?: string;
  type: DeliverableButtonType;
}) {
  const { t } = useTranslation([ "common" ,"deliverable"]);

  const Labels = {
    'cancel': t("common:actions.cancel"),
    'review': t("common:actions.make-a-review"),
    'ready-review': t("deliverable:actions.make-ready.title")
  }

  return (
    <ReadOnlyButtonWrapper>
      <ContractButton
        className={`read-only-button text-nowrap ${className}`}
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        withLockIcon={withLockIcon}
      >
        {Labels[type]}
      </ContractButton>
    </ReadOnlyButtonWrapper>
  );
}
