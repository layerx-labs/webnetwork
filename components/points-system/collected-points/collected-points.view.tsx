import { useTranslation } from "next-i18next";

import { QuestCard } from "components/points-system/collected-points/quest-card/quest-card.view";

import { PointsBase } from "interfaces/points";

interface ExtendedPointsBase extends PointsBase {
  status: "boosted" | "available" | "collected" | "pending";
  onActionClick: () => void;
}

type CollectedPointsViewProps = {
  recurring: ExtendedPointsBase[],
  available: ExtendedPointsBase[],
  collected: ExtendedPointsBase[],
};

export function CollectedPointsView({
  recurring,
  available,
  collected,
}: CollectedPointsViewProps) {
  const { t } = useTranslation("points");

  return(
    <div className="pt-2">
      <h3 className="xl-medium mb-4">
        {t("recurring-quests")}
      </h3>

      <div className="row gy-4">
        {recurring?.map(pointBase => (
          <div 
            className="col-12 col-sm-6 col-md-4 cursor-pointer"
            key={pointBase.actionName}
            role="button"
            onClick={pointBase.onActionClick}
          >
            <QuestCard
              title={t(`rules.${pointBase.actionName}.title`)}
              pointsLabel={t(`rules.${pointBase.actionName}.pointsLabel`, { count: pointBase.pointsPerAction })}
              status={pointBase?.status}
              isRecurring
            />
          </div>
        ))}
      </div>

      <h3 className="xl-medium mb-4 mt-5">
      {t("on-going-quests")}
      </h3>

      <div className="row gy-4">
        {[...available, ...collected]?.map(pointBase => (
          <div 
            className="col-12 col-sm-6 cursor-pointer"
            key={pointBase.actionName}
            role="button"
            onClick={pointBase.onActionClick}
          >
            <QuestCard
              title={t(`rules.${pointBase.actionName}.title`)}
              pointsLabel={t(`rules.${pointBase.actionName}.pointsLabel`, { count: pointBase.pointsPerAction })}
              status={pointBase?.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
}