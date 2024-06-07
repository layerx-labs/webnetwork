import GithubMark from "assets/github-mark";
import CheckCircle from "assets/icons/check-circle";
import LinkedinMark from "assets/linkedin-mark";
import XMark from "assets/x-mark";

import Button from "components/button";
import Card from "components/card";
import { PointsBadge } from "components/common/points/points-badge.view";

type SocialCardViewProps = {
  title: string,
  social: "linkedin" | "github" | "x",
  points: number | string,
  status: "claimed" | "available" | "pending",
  onActionClick: () => void,
}

export function SocialCardView({
  title,
  social,
  points,
  status,
  onActionClick,
}: SocialCardViewProps) {
  const isPending = status === "pending";
  const isClaimed = status === "claimed";
  const socialsIcon = {
    linkedin: <LinkedinMark />,
    github: <GithubMark />,
    x: <XMark />,
  }[social];

  return(
    <Card
      bg="gray-900"
      className="p-3"
      bodyClassName="p-0"
    >
      <div className="row align-items-center">
        <div className="col-auto">
          {socialsIcon}
        </div>

        <div className="col">
          <span>{title}</span>
          <span className="d-block max-width-content mt-1">
            <PointsBadge
              points={points}
            />
          </span>
        </div>

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
      </div>
    </Card>
  );
}