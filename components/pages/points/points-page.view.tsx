import CustomContainer from "components/custom-container";
import { PointsPageHero } from "components/pages/points/hero/points-page-hero.view";

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
    <CustomContainer>
      <PointsPageHero
        totalPoints={totalPoints}
        hasBoost={hasBoost}
        boostValue={boostValue}
      />
    </CustomContainer>
  );
}