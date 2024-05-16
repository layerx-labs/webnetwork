import { useState } from "react";

import { useTranslation } from "next-i18next";

import { MyPointsPageView } from "components/profile/pages/my-points/my-points.view";

import { userPointsOfUser } from "x-hooks/use-points-of-user";


export function MyPointsPage() {
  const { t } = useTranslation("profile");

  const [activeTab, setActiveTab] = useState("collected-points");

  const { totalPoints } = userPointsOfUser();

  const tabs = [
    {
      label: t("collected-points"),
      active: activeTab === "collected-points",
      onClick: () => setActiveTab("collected-points"),
    },
    {
      label: t("history"),
      active: activeTab === "history",
      onClick: () => setActiveTab("history"),
    }
  ];

  return (
    <MyPointsPageView 
      tabs={tabs}
      activeTab={activeTab}
      userTotalPoints={totalPoints}
    />
  );
}