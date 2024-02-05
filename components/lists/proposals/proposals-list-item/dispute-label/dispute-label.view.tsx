interface DisputeLabelProps {
  percentage: number;
}

export default function DisputeLabel ({
  percentage
}: DisputeLabelProps) {
  return (
    <div className="d-flex align-items-center gap-1">
      <span className="xs-small font-weight-normal text-gray-400">
        Dispute
      </span>

      <span className="xs-small font-weight-normal text-white">
        {percentage}%
      </span>
    </div>
  );
}