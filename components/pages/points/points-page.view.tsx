import CustomContainer from "components/custom-container";
import { PointsPageHero } from "components/pages/points/hero/points-page-hero.view";

interface PointsPageViewProps {
  totalPoints: number;
  hasBoost?: boolean;
}

export function PointsPageView({
  totalPoints,
  hasBoost,
}: PointsPageViewProps) {
  return(
    <CustomContainer>
      <PointsPageHero
        totalPoints={totalPoints}
        hasBoost={hasBoost}
      />
    </CustomContainer>
  );
}