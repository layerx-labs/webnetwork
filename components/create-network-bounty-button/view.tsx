import { useTranslation } from "next-i18next";

import PlusIcon from "assets/icons/plus-icon";

import Button from "components/button";
import CreateOptionsModal from "components/modals/create-options-modal/create-options-modal.controller";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

interface CreateNetworkBountyButtonViewProps {
  isOnNetwork: boolean;
  isModalVisible?: boolean;
  onClick?: () => void;
  onCloseClick?: () => void;
  actionCallBack?: () => void;
  label?: string;
}

export default function CreateNetworkBountyButtonView({
  isOnNetwork,
  isModalVisible,
  onClick,
  onCloseClick,
  actionCallBack,
  label,
}: CreateNetworkBountyButtonViewProps) {
  const { t } = useTranslation("common");

  return (
    <ReadOnlyButtonWrapper>
      <Button className="read-only-button w-100" onClick={onClick}>
        <PlusIcon />
        <span>
          {!isOnNetwork
            ? t("misc.create")
            : label
            ? label
            : (t("main-nav.new-bounty") as string)}
        </span>
      </Button>

      <CreateOptionsModal
        show={isModalVisible}
        actionCallBack={actionCallBack}
        onCloseClick={onCloseClick}
      />
    </ReadOnlyButtonWrapper>
  );
}
