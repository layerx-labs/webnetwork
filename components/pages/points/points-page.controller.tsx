import { useState } from "react";

import { useTranslation } from "next-i18next";

import { PointsPageView } from "components/pages/points/points-page.view";

import { useUserStore } from "x-hooks/stores/user/user.store";
import { userPointsOfUser } from "x-hooks/use-points-of-user";

export function PointsPage() {
  const { t } = useTranslation("points");

  const [activeTab, setActiveTab] = useState<"collected-points" | "history">("collected-points");

  const { currentUser } = useUserStore();
  const { totalPoints, pointsBase } = userPointsOfUser();

  const boost = pointsBase?.find(base => base?.scalingFactor > 1);
  const tabs = [
    {
      label: t("current-quests"),
      active: activeTab === "collected-points",
      onClick: () => setActiveTab("collected-points"),
    }
  ];

  if (currentUser?.walletAddress)
    tabs.push({
      label: t("history"),
      active: activeTab === "history",
      onClick: () => setActiveTab("history"),
    });

  return(
    <PointsPageView
      totalPoints={totalPoints}
      hasBoost={!!boost}
      boostValue={boost?.scalingFactor}
      tabs={tabs}
      activeTab={activeTab}
    />
  );
}