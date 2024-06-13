import { useTranslation } from "next-i18next";

import If from "components/If";
import { PointsLeaderboardItem as LeaderboardItem } 
  from "components/pages/points/leaderboard/item/points-leaderboard-item.view";

import { PointsLeaderboardItem } from "interfaces/points";

interface PointsLeaderboardViewProps {
  highlight: PointsLeaderboardItem;
  list: PointsLeaderboardItem[];
  isConnected?: boolean;
}

export function PointsLeaderboardView({
  highlight,
  list,
  isConnected,
}: PointsLeaderboardViewProps) {
  const { t } = useTranslation("points");

  return(
    <div>
      <h3 className="xl-medium mb-4">
        {t("leaderboard")}
      </h3>

      <span className="xs-medium text-gray-500 d-block mb-3">
        {t("your-ranking")}
      </span>

      <If
        condition={isConnected}
        otherwise={
          <div className={`d-flex align-items-center justify-content-center border-radius-8 p-4
            gradient-border-blue bg-gray-900`}>
            <span className="lg-medium text-gray-500 d-block">
              {t("connect-your-wallet")}
            </span>
          </div>
        }
      >
        <LeaderboardItem
          position={highlight?.position}
          address={highlight?.address}
          avatar={highlight?.avatar}
          handle={highlight?.handle}
          totalPoints={highlight?.totalPoints}
          variant="highlight"
        />
      </If>

      <div className="d-flex align-items-center justify-content-between mt-4 border-bottom border-gray-800 pb-3">
        <span className="xs-medium text-gray-500 d-block">
        {t("top-users")}
        </span>

        <span className="xs-medium text-gray-500 d-block">
        {t("total-points")}
        </span>
      </div>

      {list?.map(item => (
        <LeaderboardItem
          key={`points-leaderboard-${item?.address}`}
          position={item?.position}
          address={item?.address}
          avatar={item?.avatar}
          handle={item?.handle}
          totalPoints={item?.totalPoints}
        />
      ))}
    </div>
  );
}