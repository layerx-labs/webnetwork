import { useTranslation } from "next-i18next";

import { PointsIcon } from "assets/icons/points-icon";

import { GradientBadge } from "components/common/gradient-badge/gradient-badge.view";

import { formatNumberToString } from "helpers/formatNumber";

type PointsBadgeProps = {
  points: number | string,
  variant?: "outlined" | "filled",
  size?: "sm" | "md",
  isBoosted?: boolean,
}

export function PointsBadge({
  points = "0",
  variant = "outlined",
  size = "md",
  isBoosted,
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
  const color = isBoosted ? "purple" : "blue";

  return(
    <GradientBadge
      variant={variant}
      color={color}
    >
      <span className={`${styleBySize.font} text-white`}>
        {pointsLabel}
      </span>

        <PointsIcon 
          width={styleBySize.iconSize} 
          height={styleBySize.iconSize}
        />
    </GradientBadge>
  );
}