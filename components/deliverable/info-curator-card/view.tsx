import { useTranslation } from "next-i18next";
import Link from "next/link";
import { UrlObject } from "url";

import CloseIcon from "assets/icons/close-icon";
import InfoIconEmpty from "assets/icons/info-icon-empty";

import Button from "components/button";

interface DeliverableInfoCardViewProps {
  show: boolean;
  onHide: () => void;
  votingPowerHref: UrlObject;
}

export default function DeliverableInfoCardView({
  show,
  onHide,
  votingPowerHref,
}: DeliverableInfoCardViewProps) {
  const { t } = useTranslation("deliverable");

  if (!show) return <></>;

  return (
    <div className="bg-info-10 border border-info border-radius-8 p-2 ps-3 pb-3 mb-2">
      <div className="d-flex d-flex justify-content-end">
        <Button transparent className="card-close-button p-0" onClick={onHide}>
          <CloseIcon className="text-info" />
        </Button>
      </div>
      <div className="me-3">
        <span className="text-info">
          <InfoIconEmpty
            className="text-info me-2 mb-1"
            width={12}
            height={12}
          />
          {t("deliverable:infos.curators")}
          <Link href={votingPowerHref}>
            <a className=" text-primary">
              {t("deliverable:infos.get-voting-power")}
            </a>
          </Link>
        </span>
      </div>
    </div>
  );
}
