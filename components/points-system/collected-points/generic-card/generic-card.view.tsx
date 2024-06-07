import CheckCircle from "assets/icons/check-circle";

import Button from "components/button";
import Card from "components/card";
import { PointsBadge } from "components/common/points/points-badge.view";
import If from "components/If";

type GenericCardProps = {
  title: string,
  description?: string,
  points: number | string,
  status: "claimed" | "available" | "pending",
  direction?: "vertical" | "horizontal",
  onActionClick: () => void,
}

export function GenericCard({
  title,
  description,
  points,
  status,
  direction = "horizontal",
  onActionClick,
}: GenericCardProps) {
  const isPending = status === "pending";
  const isClaimed = status === "claimed";
  const isHorizontal = direction === "horizontal";

  const actionButton = (
    <div className="col-auto">
      { isClaimed ?
      <span className="text-success">
        <CheckCircle />
      </span> : 
      <Button
        color="gray-850"
        disabled={isPending}
        onClick={onActionClick}
      >
        { isPending ? "Pending" : "Get" }
      </Button>
      }
    </div>
  );

  return(
    <Card
      bg="gray-900"
      className="p-3"
      bodyClassName="p-0"
    >
      <div className="row align-items-center gy-3">
        <div className="col">
          <span className="d-block xs-medium text-white mb-2">
            {title}
          </span>

          <If condition={!!description}>
            <span className="d-block sm-regular text-gray-50 mb-3">
              {description}
            </span>
          </If>

          <span className="d-block max-width-content mt-1">
            <PointsBadge
              points={points}
            />
          </span>

          <If condition={!isHorizontal}>
            <div className="mt-3">
              {actionButton}
            </div>
          </If>
        </div>

        <If condition={isHorizontal}>
          {actionButton}
        </If>
      </div>
    </Card>
  );
}