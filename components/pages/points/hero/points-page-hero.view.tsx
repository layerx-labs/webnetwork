import { useTranslation } from "next-i18next";

import { PointsBadge } from "components/common/points/points-badge.view";

interface PointsPageHeroProps {
  totalPoints: number;
  hasBoost?: boolean;
}

export function PointsPageHero({
  totalPoints,
  hasBoost,
}: PointsPageHeroProps) {
  const { t } = useTranslation("points");

  return(
    <div className={`row py-5 points-hero points-hero${hasBoost ? "-boosted" : ""}`}>
      <div className="col">
        <h3 className="text-white">{t("your-points")}</h3>

        <p className="family-Regular base-medium mt-2 text-gray-200">{t("collect-bepro")}</p>

        <div className="d-flex mt-4 pt-2">
          <PointsBadge
            points={totalPoints}
          />
        </div>
      </div>
    </div>
  );
}