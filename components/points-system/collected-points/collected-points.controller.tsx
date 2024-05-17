import { useEffect } from "react";

import { useTranslation } from "next-i18next";

import Card from "components/card";
import { GenericCard } from "components/points-system/collected-points/generic-card/generic-card.view";
import { OnGoingCard } from "components/points-system/collected-points/on-going-card/on-going-card.view";
import { SocialCard } from "components/points-system/collected-points/social-card/social-card.controller";

import { PointsEvents } from "interfaces/points";

import { userPointsOfUser } from "x-hooks/use-points-of-user";

export function CollectedPoints() {
  const { t } = useTranslation("points");

  const { collectedPoints, pointsBase, refresh } = userPointsOfUser();

  const getCollected = (actionName: string) => collectedPoints?.find(c => c.actionName === actionName);
  const getPointStatus = (event: PointsEvents) => {
    if (!event)
      return "available";
    if (!event.pointsCounted)
      return "pending";
    return "claimed";
  };
  const getSocialName = (actionName: string) => {
    if (actionName?.includes("linkedin"))
      return "linkedin";
    if (actionName?.includes("github"))
      return "github";
    if (actionName?.includes("x"))
      return "x";
  };

  const { onGoing, socials, profile, other } = pointsBase.reduce((acc, curr) => {
    const collected = getCollected(curr.actionName);
    const status = getPointStatus(collected);
    const pointsPerAction = status === "available" ? curr.pointsPerAction * curr.scalingFactor : collected.pointsWon;
    const currUpdated = {
      ...curr,
      status,
      pointsPerAction
    };

    if (["linkedin", "github", "x"].some(social => curr.actionName.includes(social)))
      acc.socials.push(currUpdated);
    else if (["email", "add_about"].some(e => curr.actionName.includes(e)))
      acc.profile.push(currUpdated);
    else if (curr.counter === "N")
      acc.onGoing.push(curr);
    else
      acc.other.push(currUpdated);

    return acc;
  }, { onGoing: [], socials: [], profile: [], other: [] });

  useEffect(() => {
    refresh()
  }, []);

  return(
    <div className="pt-2">
      <Card 
        className="p-3 mt-4 mb-4" 
        bodyClassName="p-0"
      >
        <div className="row align-items-center gap-3 gap-md-0">
          <div className="col-auto">
            <span className="d-block xl-semibold text-white">
              {t("on-going")}
            </span>

            <span className="d-block xl-semibold text-white">
            {t("quests")}
            </span>

            <img 
              src="/images/medal.png" 
              alt="Medal" 
              height={73}
            />
          </div>

          {onGoing.map(pointBase => (
            <div className="col-12 col-md" key={`on-going-${pointBase.actionName}`}>
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

      <div className="row mb-4">
        {socials?.map(pointBase => (
          <div className="col col-sm-4" key={`social-${pointBase.actionName}`}>
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

      <div className="row mb-4">
        {profile?.map(pointBase => (
          <div className="col col-sm-4" key={`social-${pointBase.actionName}`}>
            <GenericCard
              title={t(`rules.${pointBase.actionName}.title`)}
              description={t(`rules.${pointBase.actionName}.description`)}
              points={t(`rules.${pointBase.actionName}.pointsLabel`, { count: pointBase.pointsPerAction })}
              status={pointBase.status}
              onActionClick={() => {}}
            />
          </div>
        ))}
      </div>

      <div className="row mb-3">
        <span className="base-semibold text-white">{t("other")}</span>
      </div>

      <div className="row mb-4">
        {other?.map(pointBase => (
          <div className="col-12 col-sm" key={`social-${pointBase.actionName}`}>
            <GenericCard
              title={t(`rules.${pointBase.actionName}.title`)}
              description={t(`rules.${pointBase.actionName}.description`)}
              points={pointBase.pointsPerAction}
              status={pointBase.status}
              direction="vertical"
              onActionClick={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
}