import { useTranslation } from "next-i18next";

import { GradientBadge } from "components/common/gradient-badge/gradient-badge.view";
import { PointsBadge } from "components/common/points/points-badge.view";
import If from "components/If";

interface PointsPageHeroProps {
  totalPoints: number;
  hasBoost?: boolean;
  boostValue?: number;
}

export function PointsPageHero({
  totalPoints,
  hasBoost,
  boostValue,
}: PointsPageHeroProps) {
  const { t } = useTranslation("points");

  return(
    <div className={`row py-5 points-hero points-hero${hasBoost ? "-boosted" : ""}`}>
      <div className="col">
        <h3 className="text-white">{t("your-points")}</h3>

        <p className="family-Regular base-medium mt-2 text-gray-200">{t("collect-bepro")}</p>

        <div className="d-flex align-items-center gap-3 mt-4 pt-2">
          <PointsBadge
            points={totalPoints}
          />

          <If condition={hasBoost}>
            <GradientBadge
              variant="filled"
              color="purple"
            >
              <span className="xs-medium text-white">{t("booster-active")}</span>
              <span className="base-medium text-gradient-purple">{boostValue}x</span>
            </GradientBadge>
          </If>
        </div>
      </div>
    </div>
  );
}