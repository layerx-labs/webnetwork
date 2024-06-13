import CustomContainer from "components/custom-container";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";
import {PointsPageHero} from "components/pages/points/hero/points-page-hero.view";
import { PointsLeaderboard } from "components/pages/points/leaderboard/points-leaderboard.controller";
import {CollectedPoints} from "components/points-system/collected-points/collected-points.controller";

import { MiniTabsItem } from "types/components";

import {MyPointsHistory} from "../../profile/pages/my-points/history/my-points-history.controller";

interface PointsPageViewProps {
  totalPoints: number;
  hasBoost?: boolean;
  boostValue?: number;
  tabs: MiniTabsItem[];
  activeTab: "collected-points" | "history";
}

export function PointsPageView({
  totalPoints,
  hasBoost,
  boostValue,
  tabs,
  activeTab,
}: PointsPageViewProps) {
  const tabsComponents = {
    "history": <MyPointsHistory />,
    "collected-points": <>
      <CollectedPoints />
      <div className="mt-4 pt-3">
        <PointsLeaderboard />
      </div>
    </>,
  };

  return(
    <CustomContainer className="pb-5">
      <PointsPageHero
        totalPoints={totalPoints}
        hasBoost={hasBoost}
        boostValue={boostValue}
      />

      <ScrollableTabs
        tabs={tabs}
      />

      <div className="mt-4">
        {tabsComponents[activeTab]}
      </div>

    </CustomContainer>
  );
}