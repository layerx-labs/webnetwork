import Card from "components/card";
import { PointsBadge } from "components/common/points/points-badge.view";

type OnGoingCardProps = {
  title: string,
  description: string,
  pointsLabel: string
}

export function OnGoingCard({
  title,
  description,
  pointsLabel,
}: OnGoingCardProps) {
  return(
    <Card
      bg="gray-850"
      className="p-3"
      bodyClassName="p-0 d-flex flex-column"
    >
      <span className="xs-medium text-white mb-2">
        {title}
      </span>

      <span className="sm-regular text-gray-50 mb-3">
        {description}
      </span>

      <div className="max-width-content">
        <PointsBadge
          points={pointsLabel}
          variant="available"
        />
      </div>
    </Card>
  );
}