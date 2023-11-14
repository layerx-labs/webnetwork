import { useTranslation } from "next-i18next";

import CodeIcon from "assets/icons/task/types/code-icon";
import DesignIcon from "assets/icons/task/types/design-icon";
import OtherIcon from "assets/icons/task/types/other-icon";

import Badge from "components/badge";

interface TaskTypeBadgeProps {
  type: string;
  responsiveLabel?: boolean;
}
export default function TaskTypeBadge ({
  type,
  responsiveLabel = true
}: TaskTypeBadgeProps) {
  const { t } = useTranslation("bounty");

  const ICONS = {
    code: <CodeIcon />,
    design: <DesignIcon />,
    other: <OtherIcon />,
  };
  const responsiveLabelClass = responsiveLabel ? "d-none d-md-block" : "";

  return(
    <div>
      <Badge
        className="border-radius-4 sm-regular text-uppercase text-gray-500 px-2 py-1 border border-gray-800"
        color="gray-850"
      >
        <div className="d-flex align-items-center gap-1">
          {ICONS[type]}
          <div className={responsiveLabelClass}>
            {t(`types.${type}`)}
          </div>
        </div>
      </Badge>
    </div>
  );
}