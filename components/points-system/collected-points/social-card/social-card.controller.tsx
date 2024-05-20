import { SocialCardView } from "components/points-system/collected-points/social-card/social-card.view";

import useMarketplace from "x-hooks/use-marketplace";

type SocialCardProps = {
  title: string,
  social: "linkedin" | "github" | "x",
  points: number | string,
  status: "claimed" | "available" | "pending",
}

export function SocialCard({
  title,
  social,
  points,
  status,
}: SocialCardProps) {
  const { goToProfilePage } = useMarketplace();

  return(
    <SocialCardView
      title={title}
      social={social}
      points={points}
      status={status}
      onActionClick={() => goToProfilePage("dashboard")}
    />
  );
}