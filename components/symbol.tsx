import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { useTranslation } from "next-i18next";

export default function Symbol({ name }: { name: string }) {
  const { t } = useTranslation(["common"]);

  return (
    <OverlayTrigger
      key="bottom-githubPath"
      placement="bottom"
      overlay={<Tooltip id={"tooltip-bottom"}>{name}</Tooltip>}
    >
      <span className="symbol text-truncate">
        <>{name || t("common:misc.token")}</>
      </span>
    </OverlayTrigger>
  );
}
