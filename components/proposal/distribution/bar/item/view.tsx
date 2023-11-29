import AvatarOrIdenticon from "components/avatar-or-identicon";
import If from "components/If";
import InfoTooltip from "components/info-tooltip";

import {formatNumberToString} from "helpers/formatNumber";

export default function DistributionBarItem({
  percentage,
  recipient,
  handle = null,
  label = "",
  description = "",
  progressColor = "primary",
}) {
  return (
    <div
      className="rounded-bottom d-flex flex-column align-self-end align-items-center gap-2 min-w-fit"
      style={{ width: `${percentage || 25}%` }}
    >
      <If
        condition={!!handle}
        otherwise={
          <span className="text-gray-500 text-uppercase xs-medium mt-1">
            {label}
          </span>
        }
      >
        <AvatarOrIdenticon user={handle} address={recipient} size="sm"/>
      </If>

      <div className="d-flex gap-1">
        <span className="caption-small">
          {formatNumberToString(percentage, 2)}%
        </span>

        <If condition={!!description}>
          <InfoTooltip description={description} secondaryIcon={true} />
        </If>
      </div>

      <span className={`w-100 bg-${progressColor} p-1 rounded`} />
    </div>
  );
}
