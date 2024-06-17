import AvatarOrIdenticon from "components/avatar-or-identicon";
import { PointsBadge } from "components/common/points/points-badge.view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";

import { formatNumberToCurrency } from "helpers/formatNumber";

interface PointsLeaderboardItemProps {
  position: number;
  address: string;
  avatar?: string;
  handle?: string;
  totalPoints: number;
  variant?: "list" | "highlight";
}

export function PointsLeaderboardItem({
  position,
  address,
  avatar,
  handle,
  totalPoints,
  variant = "list",
}: PointsLeaderboardItemProps) {
  const containerStyle = {
    list: "border-bottom border-gray-800",
    highlight: "border-radius-8 gradient-border-blue bg-gray-900",
  }[variant];
  const positionStyle = {
    1: "bg-gold",
    2: "bg-silver",
    3: "bg-bronze",
  }[position] || "bg-gray-850";

  return(
    <div className={`d-flex gap-3 align-items-center p-3 ${containerStyle}`}>
      <span className={`xs-medium text-white py-1 px-2 rounded-pill ${positionStyle}`}>
        {position}
      </span>

      <div className="d-flex align-items-center gap-3 flex-grow-1">
        <AvatarOrIdenticon
          user={{
            address: address,
            avatar: avatar
          }}
          size="lg"
        />

        <span className="base-medium text-white">
          <UserProfileLink
            address={address}
            handle={handle}
            transformHandle={false}
          />
        </span>
      </div>

      <PointsBadge
        points={formatNumberToCurrency(totalPoints, { maximumFractionDigits: 0 })}
        variant="filled"
        size="sm"
      />
    </div>
  );
}