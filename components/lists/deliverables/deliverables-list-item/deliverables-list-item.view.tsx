import React from "react";

import { useTranslation } from "next-i18next";

import MessageBalloonIcon from "assets/icons/message-balloon.icon";

import CardItem from "components/card-item";
import MarketplaceWithNetworkLogo
  from "components/common/marketplace-with-network-logo/marketplace-with-network-logo.view";
import StatusBadge from "components/common/status-badge/status-badge.view";
import { ResponsiveEle } from "components/responsive-wrapper";

import { Deliverable } from "interfaces/issue-data";

import { Status } from "types/components";

interface DeliverablesListItemViewProps {
  deliverable: Deliverable;
  status: Status;
  timeDifferenceText: string;
  onClick?: () => void;
}
export function DeliverablesListItemView ({
  deliverable,
  status,
  timeDifferenceText,
  onClick,
}: DeliverablesListItemViewProps) {
  const { t } = useTranslation("common");

  return (
    <CardItem onClick={onClick} data-testid={`deliverable-list-item-${deliverable?.id}`}>
      <div className="row align-items-center mb-4 pb-2">
        <div className="col-auto">
          <MarketplaceWithNetworkLogo
            networkLogo={deliverable?.issue?.chain?.icon}
            marketplaceLogo={deliverable?.issue?.network?.logoIcon}
          />
        </div>

        <div className="col text-truncate">
          <h4 className="base-medium text-white text-truncate mb-1">{deliverable?.title}</h4>

          <div className="d-flex">
            <span className="xs-medium text-gray-200 text-capitalize mr-1">
              {deliverable?.issue?.network?.name} #{deliverable?.issue?.id}
            </span>

            <ResponsiveEle
              className="text-truncate"
              tabletView={
                <span className="xs-medium font-weight-normal text-gray-400 text-truncate">
                  {deliverable?.issue?.title}
                </span>
              }
            />
          </div>
        </div>
      </div>

      <div className="row align-items-center gx-3">
        <div className="col-auto">
          <StatusBadge status={status} />
        </div>

        <div className="col-auto">
          <span className="xs-small font-weight-normal text-gray-400">
            {t("misc.opened")} {timeDifferenceText}
          </span>
        </div>

        <div className="col">
          <div className="d-flex gap-2 text-gray-400 align-items-center justify-content-end">
            <MessageBalloonIcon />
            <span className="xs-small font-weight-normal text-gray-300">
              {deliverable?.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </CardItem>
  );
}