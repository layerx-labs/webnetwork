import { useTranslation } from "next-i18next";

import { GradientBadge } from "components/common/gradient-badge/gradient-badge.view";
import { PointsBadge } from "components/common/points/points-badge.view";
import If from "components/If";

type QuestCardProps = {
  title: string,
  pointsLabel: string,
  status: "boosted" | "available" | "collected" | "pending",
  isRecurring?: boolean;
}

export function QuestCard({
  title,
  pointsLabel,
  status,
  isRecurring,
}: QuestCardProps) {
  const { t } = useTranslation("points");

  const isBoosted = status === "boosted";
  const isAvailable = isBoosted || status === "available";
  const border = (isRecurring ? {
    boosted: "gradient-border-purple",
    available: "gradient-border-blue",
  } : {
    boosted: "gradient-border-purple",
  })[status] || "border border-gray-800";
  const background = (isRecurring ? {
    boosted: "gradient-bg-black",
    available: "gradient-bg-black",
  } : {
    available: "bg-gray-900",
    boosted: "bg-gray-900",
    pending: "bg-gray-950",
    collected: "bg-gray-950"
  })[status];
  const text = {
    boosted: "text-white",
    available: "text-white",
  }[status] || "text-gray-400";

  return(
    <div className={`d-flex flex-column gap-4 border-radius-8 p-3 ${border} ${background}`}>
      <span className={`base-medium z-2 ${text}`}>{title}</span>
    
      <div className="d-flex z-2">
        <If
          condition={isAvailable}
          otherwise={
            <div className="opacity-75">
              <GradientBadge>
                <span className="xs-medium">
                  {t(`status.${status}`)}
                </span>
              </GradientBadge>
            </div>
          }
        >
          <PointsBadge
            points={pointsLabel}
            isBoosted={isBoosted}
            variant="filled"
            size="sm"
          />
        </If>
      </div>
    </div>
  );
}