import { PointsPageView } from "components/pages/points/points-page.view";

import { userPointsOfUser } from "x-hooks/use-points-of-user";

export function PointsPage() {
  const { totalPoints, pointsBase } = userPointsOfUser();

  const boost = pointsBase?.find(base => base?.scalingFactor > 1);

  return(
    <PointsPageView
      totalPoints={totalPoints}
      hasBoost={!!boost}
      boostValue={boost?.scalingFactor}
    />
  );
}