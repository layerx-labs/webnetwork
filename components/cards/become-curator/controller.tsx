import { useState } from "react";

import { useTranslation } from "next-i18next";

import BecomeCuratorCardView from "components/cards/become-curator/view";

import {formatNumberToNScale} from "helpers/formatNumber";

import useMarketplace from "x-hooks/use-marketplace";

interface BecomeCuratorCardProps {
  isCouncil?: boolean;
}

export default function BecomeCuratorCard({
  isCouncil = false
}: BecomeCuratorCardProps) {
  const { t } = useTranslation(["council", "common"]);

  const [show, setShow] = useState<boolean>(!isCouncil);
  
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const councilAmount = formatNumberToNScale(+activeMarketplace?.councilAmount);
  const networkTokenSymbol = activeMarketplace?.networkToken?.symbol || t("common:misc.token");
  const votingPowerHref = getURLWithNetwork("/profile/[[...profilePage]]");
  const marketplaceName = activeMarketplace?.name?.toLowerCase();
  const votingPowerAlias = `/${marketplaceName}/profile/voting-power`;

  function onHide() {
    setShow(false);
  }

  return (
    <BecomeCuratorCardView
      show={show}
      onHide={onHide}
      councilAmount={councilAmount}
      networkTokenSymbol={networkTokenSymbol}
      votingPowerHref={votingPowerHref}
      votingPowerAlias={votingPowerAlias}
    />
  );
}
