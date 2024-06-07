import { useTranslation } from "next-i18next";

import { PointsIcon } from "assets/icons/points-icon";

import { formatNumberToString } from "helpers/formatNumber";

type PointsBadgeProps = {
  points: number | string,
  variant?: "outlined" | "filled",
  size?: "sm" | "md";
}

export function PointsBadge({
  points = "0",
  variant = "outlined",
  size = "md",
}: PointsBadgeProps) {
  const { t } = useTranslation("points");

  const pointsLabel = typeof points === "number" ? 
    `${formatNumberToString(points, 0)} ${t("pointsWithoutCount", { count: points })}` :
    points;
  const styleBySize = {
    sm: {
      font: "xs-medium",
      iconSize: 16
    },
    md: {
      font: "lg-medium",
      iconSize: 21.33
    }
  }[size];

  return(
    <div className="points-badge-wrapper">
      <div className={`points-badge-content points-badge-content-${variant}`}>
        <span className={`${styleBySize.font} text-white`}>
          {pointsLabel}
        </span>

        <PointsIcon 
          width={styleBySize.iconSize} 
          height={styleBySize.iconSize}
        />
      </div>
    </div>
  );
}