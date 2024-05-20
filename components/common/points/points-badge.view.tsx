import StarFilledIcon from "assets/icons/star-filled-icon";
import StarIcon from "assets/icons/star-icon"

type PointsBadgeProps = {
  points: number | string,
  variant?: "default" | "available" | "claimed",
}

export function PointsBadge({
  points,
  variant = "default",
}: PointsBadgeProps) {
  const { bg, text, icon } = {
    default: { bg: "yellow-400", text: "black", icon: <StarIcon /> },
    available: { bg: "gray-700", text: "white", icon: <StarFilledIcon /> },
    claimed: { bg: "green-600", text: "black", icon: <StarIcon /> },
  }[variant];

  return(
    <div className={`d-flex align-items-center gap-1 bg-${bg} text-${text} not-hover px-2 py-1 border-radius-4`}>
      {icon}
      <span className={`xs-small font-weight-normal text-${text}`}>{points}</span>
    </div>
  );
}