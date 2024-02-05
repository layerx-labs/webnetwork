import { useTranslation } from "next-i18next";

interface DisputeLabelProps {
  percentage: number;
}

export default function DisputeLabel ({
  percentage
}: DisputeLabelProps) {
  const { t } = useTranslation("common");

  return (
    <div className="d-flex align-items-center gap-1">
      <span className="xs-small font-weight-normal text-gray-400">
        {t("actions.dispute")}
      </span>

      <span className="xs-small font-weight-normal text-white">
        {percentage}%
      </span>
    </div>
  );
}