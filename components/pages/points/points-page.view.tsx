import CustomContainer from "components/custom-container";
import { PointsPageHero } from "components/pages/points/hero/points-page-hero.view";
import { CollectedPoints } from "components/points-system/collected-points/collected-points.controller";

interface PointsPageViewProps {
  totalPoints: number;
  hasBoost?: boolean;
  boostValue?: number;
}

export function PointsPageView({
  totalPoints,
  hasBoost,
  boostValue,
}: PointsPageViewProps) {
  return(
    <CustomContainer className="pb-5">
      <PointsPageHero
        totalPoints={totalPoints}
        hasBoost={hasBoost}
        boostValue={boostValue}
      />

      <CollectedPoints />
    </CustomContainer>
  );
}