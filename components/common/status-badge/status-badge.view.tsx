import CheckMarkIcon from "assets/icons/checkmark-icon";
import DashedCircleIcon from "assets/icons/dashed-circle-icon";
import ErrorMarkRegular from "assets/icons/error-mark-regular";

import Badge from "components/badge";

import { Status } from "types/components";

interface StatusBadgeProps {
  status: Status;
}

const getColors = (badge: string, text: string, border: string) => ({ badge, text, border });
export default function StatusBadge ({
  status
}: StatusBadgeProps) {
  const baseClasses = "d-flex align-items-center rounded-pill px-2 py-1 gap-1 border";
  const icon = {
    review: <DashedCircleIcon />,
    draft: <DashedCircleIcon />,
    "not-accepted": <ErrorMarkRegular />,
    canceled: <ErrorMarkRegular />,
    accepted: <CheckMarkIcon />,
  }[status];
  const colors = {
    review: getColors("orange-10", "orange-100", "orange-25"),
    draft: getColors("gray-800", "gray", "gray-400"),
    "not-accepted": getColors("red-10", "red-100", "red-25"),
    canceled: getColors("red-10", "red-100", "red-25"),
    accepted: getColors("success-10", "success", "success-25"),
  }[status];
  const label = {
    review: "In review",
    draft: "Draft",
    "not-accepted": "Not accepted",
    canceled: "Canceled",
    accepted: "Accepted",
  }[status];

  return (
  <Badge
    className={`${baseClasses} text-${colors?.text} border-${colors?.border}`}
    color={colors?.badge}
  >
    {icon}
    <span className="font-weight-medium">
      {label}
    </span>
  </Badge>
  );
}