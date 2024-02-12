import React from "react";

import clsx from "clsx";

interface TaskIdTagProps {
  taskId: string | number;
  marketplaceName?: string;
  disabled?: boolean;
}
export default function TaskIdTag ({
  taskId,
  marketplaceName,
  disabled
}: TaskIdTagProps) {
  return (
    <span className={clsx([
      "caption-small font-weight-normal text-truncate",
      disabled && "text-decoration-line text-gray-600" || "text-gray-500",
    ])}>
        {marketplaceName ? `${marketplaceName}-${taskId}` : `#${taskId}`}
      </span>
  );
}