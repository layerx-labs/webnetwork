import { useTranslation } from "next-i18next";

import UserIcon from "assets/icons/user";
import UsersIcon from "assets/icons/users";

import { Tooltip } from "components/common/tooltip/tooltip.view";
import { ResponsiveEle } from "components/responsive-wrapper";

interface WinnersBadgeProps {
  isMultiple? : boolean;
  responsiveLabel?: boolean;
  onlyIcon?: boolean;
}

export function WinnersBadge({
  isMultiple,
  responsiveLabel,
  onlyIcon,
}: WinnersBadgeProps) {
  const { t } = useTranslation("bounty");

  const icon = isMultiple ? <UsersIcon /> : <UserIcon />;
  const label = isMultiple ? t("multiple-winners") : t("single-winner");

  function renderLabel() {
    if (onlyIcon) 
      return <></>;

    if (responsiveLabel)
      return (
        <ResponsiveEle
          tabletView={<span>{label}</span>}
        />
      );

    return (
      <span>{label}</span>
    );
  }

  return(
    <Tooltip tip={label}>
      <div className={`d-flex align-items-center gap-2 text-gray-200 xs-medium bg-gray-850 
        border border-gray-800 border-radius-4 p-2`}>
        {icon}
        {renderLabel()}
      </div>
    </Tooltip>
  );
}