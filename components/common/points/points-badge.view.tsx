import StarIcon from "assets/icons/star-icon"

type PointsBadgeProps = {
  points: number
}

export function PointsBadge({
  points
}: PointsBadgeProps) {
  return(
    <div className="d-flex align-items-center gap-1 bg-yellow-400 text-black px-2 py-1 border-radius-4">
      <StarIcon />
      <span className="xs-small font-weight-normal">{points}</span>
    </div>
  );
}