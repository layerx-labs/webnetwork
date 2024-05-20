import { useTranslation } from "next-i18next";
import Image from "next/image";

import Card from "components/card";
import { GenericCard } from "components/points-system/collected-points/generic-card/generic-card.view";
import { OnGoingCard } from "components/points-system/collected-points/on-going-card/on-going-card.view";
import { SocialCard } from "components/points-system/collected-points/social-card/social-card.controller";

import { PointsBase } from "interfaces/points";

interface ExtendedPointsBase extends PointsBase {
  status: "claimed" | "available" | "pending";
  onActionClick: () => void;
}

type CollectedPointsViewProps = {
  onGoing: PointsBase[],
  socials: ExtendedPointsBase[],
  profile: ExtendedPointsBase[],
  other: ExtendedPointsBase[],
  getSocialName: (actionName: string) => "linkedin" | "github" | "x";
};

export function CollectedPointsView({
  onGoing,
  socials,
  profile,
  other,
  getSocialName,
}: CollectedPointsViewProps) {
  const { t } = useTranslation("points");

  return(
    <div className="pt-2">
      <Card 
        className="p-3 mt-4 mb-4" 
        bodyClassName="p-0"
      >
        <div className="row align-items-center gy-3 gap-md-0">
          <div className="col-auto">
            <span className="d-block xl-semibold text-white">
              {t("on-going")}
            </span>

            <span className="d-block xl-semibold text-white">
            {t("quests")}
            </span>

            <Image 
              src="/images/medal.png" 
              alt="Medal" 
              height={73}
              width={73}
            />
          </div>

          {onGoing.map(pointBase => (
            <div className="col-12 col-lg" key={`on-going-${pointBase.actionName}`}>
              <OnGoingCard
                title={t(`rules.${pointBase.actionName}.title`)}
                description={t(`rules.${pointBase.actionName}.description`)}
                pointsLabel={t(`rules.${pointBase.actionName}.pointsLabel`, { count: pointBase.pointsPerAction })}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="row mb-3">
        <span className="base-semibold text-white">{t("add-your-socials")}</span>
      </div>

      <div className="row mb-4 gy-3">
        {socials?.map(pointBase => (
          <div className="col-12 col-md-6 col-xl-4" key={`social-${pointBase.actionName}`}>
            <SocialCard
              title={t(`rules.${pointBase.actionName}.title`)}
              social={getSocialName(pointBase.actionName)}
              points={t(`rules.${pointBase.actionName}.pointsLabel`, { count: pointBase.pointsPerAction })}
              status={pointBase.status}
            />
          </div>
        ))}
      </div>

      <div className="row mb-3">
        <span className="base-semibold text-white">{t("complete-your-profile")}</span>
      </div>

      <div className="row mb-4 gy-3">
        {profile?.map(pointBase => (
          <div className="col-12 col-sm-6 col-xl-4" key={`social-${pointBase.actionName}`}>
            <GenericCard
              title={t(`rules.${pointBase.actionName}.title`)}
              description={t(`rules.${pointBase.actionName}.description`)}
              points={t(`rules.${pointBase.actionName}.pointsLabel`, { count: pointBase.pointsPerAction })}
              status={pointBase.status}
              onActionClick={pointBase.onActionClick}
            />
          </div>
        ))}
      </div>

      <div className="row mb-3">
        <span className="base-semibold text-white">{t("other")}</span>
      </div>

      <div className="row mb-4 gy-3">
        {other?.map(pointBase => (
          <div className="col-12 col-sm-6 col-xl" key={`social-${pointBase.actionName}`}>
            <GenericCard
              title={t(`rules.${pointBase.actionName}.title`)}
              description={t(`rules.${pointBase.actionName}.description`)}
              points={pointBase.pointsPerAction}
              status={pointBase.status}
              direction="vertical"
              onActionClick={pointBase.onActionClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}