import { ReactNode } from "react";

import clsx from "clsx";

interface SelectableCardProps {
  isSelected?: boolean;
  icon?: ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function SelectableCard ({
  isSelected,
  icon,
  title,
  description,
  onClick,
}: SelectableCardProps) {
  return (
    <div
      className={clsx([
        "d-flex flex-column border-radius-8 p-3 cursor-pointer border",
        isSelected ? "bg-primary border-primary" : "bg-gray-800 border-gray-700",
      ])}
      onClick={onClick}
      data-testid={title}
      role="button"
    >
      <div className="position-relative">
        <span className={clsx([
          "border border-2 rounded-circle position-absolute p-2 ",
          isSelected ? "bg-transparent border-white" : "bg-gray-850",
        ])}></span>
        {icon}
      </div>
      <span className="base-medium text-white mb-1">
        {title}
      </span>
      <span className="xs-small text-blue-150 font-weight-normal">
        {description}
      </span>
    </div>
  );
}