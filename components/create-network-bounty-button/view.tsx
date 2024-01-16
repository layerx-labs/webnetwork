import {useTranslation} from "next-i18next";

import PlusIcon from "assets/icons/plus-icon";

import Button from "components/button";
import If from "components/If";
import InternalLink from "components/internal-link";
import CreateOptionsModal from "components/modals/create-options-modal/create-options-modal.controller";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

interface CreateNetworkBountyButtonViewProps {
  isOnNetwork: boolean;
  isModalVisible?: boolean;
  label?: string;
  onClick?: () => void;
  onCloseClick?: () => void;
  actionCallBack?: () => void;
}

export default function CreateNetworkBountyButtonView({
  isOnNetwork,
  isModalVisible,
  onClick,
  onCloseClick,
  actionCallBack,
  label
}: CreateNetworkBountyButtonViewProps) {
  const { t } = useTranslation("common");

  return(
    <ReadOnlyButtonWrapper>
      <If 
        condition={isOnNetwork}
        otherwise={
          <Button
            className="read-only-button w-100"
            data-test-id="create-btn"
            onClick={onClick}
          >
            <PlusIcon />
            <span>{t("misc.create")}</span>
          </Button>
        }
      >
        <InternalLink
          href={"/create-task"}
          data-test-id="create-task-link"
          icon={<PlusIcon />}
          label={label ? label : t("main-nav.new-bounty") as string}
          iconBefore
          uppercase
        />
      </If>
      <CreateOptionsModal
        show={isModalVisible}
        actionCallBack={actionCallBack}
        onCloseClick={onCloseClick}
      />
  </ReadOnlyButtonWrapper>
  );
}