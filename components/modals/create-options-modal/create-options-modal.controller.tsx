import { useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import CreateMarketplaceIcon from "assets/icons/create-marketplace";
import CreateMarketplaceMobileIcon from "assets/icons/create-marketplace-mobile";
import ExpertHelpIcon from "assets/icons/expert-help";
import ExpertHelpMobileIcon from "assets/icons/expert-help-mobile";
import GlobalIcon from "assets/icons/global-icon";
import GlobalIconMobile from "assets/icons/global-icon-mobile";

import CreateOptionsModalView from "components/modals/create-options-modal/create-options-modal.view";

import useBreakPoint from "x-hooks/use-breakpoint";
import { useSettings } from "x-hooks/use-settings";

interface CreateOptionsModalProps {
  show?: boolean;
  onCloseClick?: () => void;
}

export default function CreateOptionsModal ({
  show,
  onCloseClick,
}: CreateOptionsModalProps) {
  const { push } = useRouter();
  const { t } = useTranslation("common");
  
  const [selectedOption, setSelectedOption] = useState<number>();

  const { settings } = useSettings();
  const { isMobileView, isTabletView } = useBreakPoint();

  const hasSelected = typeof selectedOption === "number";
  const useMobileIcon = isMobileView || isTabletView;

  const Option = (title, description, icon, mobileIcon, url, blank = false) => ({
    icon: useMobileIcon ? mobileIcon : icon,
    title,
    description,
    url,
    blank
  });

  const options = [
    Option( t("modals.create-marketplace-options.options.launch-in-open-marketplace.title"),
            t("modals.create-marketplace-options.options.launch-in-open-marketplace.description"),
            GlobalIcon,
            GlobalIconMobile,
            "/create-task?marketplace=open-marketplace"),
    Option( t("modals.create-marketplace-options.options.get-help.title"),
            t("modals.create-marketplace-options.options.get-help.description"),
            ExpertHelpIcon,
            ExpertHelpMobileIcon,
            settings?.forms?.createMarketplaceHelp,
            true),
    Option( t("modals.create-marketplace-options.options.create-marketplace.title"),
            t("modals.create-marketplace-options.options.create-marketplace.description"),
            CreateMarketplaceIcon,
            CreateMarketplaceMobileIcon,
            "/new-marketplace"),
  ];

  function handleClose () {
    setSelectedOption(null);
    onCloseClick();
  }

  function onContinueClick () {
    if (!hasSelected)
      return;
    handleClose();
    const { url, blank } = options[selectedOption];
    if (blank)
      window.open(url);
    else
      push(url);
  }

  return(
    <CreateOptionsModalView
      show={show}
      onCloseClick={handleClose}
      onContinueClick={onContinueClick}
      isContinueButttonDisabled={!hasSelected}
      options={options}
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      hideSubTitle={useMobileIcon}
    />
  );
}