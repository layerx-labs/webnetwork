import React from "react";

import { useTranslation } from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import CardItem from "components/card-item";
import MarketplaceWithNetworkLogo
  from "components/common/marketplace-with-network-logo/marketplace-with-network-logo.view";
import StatusBadge from "components/common/status-badge/status-badge.view";
import DisputeLabel from "components/lists/proposals/proposals-list-item/dispute-label/dispute-label.view";
import { ResponsiveEle } from "components/responsive-wrapper";

import { truncateAddress } from "helpers/truncate-address";

import { Proposal } from "interfaces/proposal";

import { Status } from "types/components";

interface ProposalsListItemViewProps {
  proposal: Proposal;
  disputePercentage: number;
  timeText: string;
  status: Status;
  onClick?: () => void;
}
export function ProposalsListItemView ({
  proposal,
  disputePercentage,
  timeText,
  status,
  onClick,
}: ProposalsListItemViewProps) {
  const { t } = useTranslation("common");
  
  return (
    <CardItem onClick={onClick} data-testid={`proposal-list-item-${proposal?.id}`}>
      <div className="row align-items-center mb-4">
        <div className="col-auto">
          <MarketplaceWithNetworkLogo
            networkLogo={proposal?.network?.chain?.icon}
            marketplaceLogo={proposal?.network?.logoIcon}
          />
        </div>

        <div className="col text-truncate">
          <h4 className="base-medium text-white text-truncate mb-1">
            {t("misc.proposal")} #{proposal?.id}
          </h4>

          <div className="d-flex">
            <span className="xs-medium text-gray-200 text-capitalize mr-1">
              {proposal?.network?.name} #{proposal?.issue?.id}
            </span>
          </div>
        </div>

        <div className="col-auto">
          <ResponsiveEle
            tabletView={
              <div className="d-flex align-items-center gap-3">
                <span className="xs-small font-weight-normal text-gray-400">
                  {t("misc.opened")} {timeText}
                </span>

                <StatusBadge status={status} />
              </div>
            }
          />
        </div>
      </div>

      <div className="row align-items-center justify-content-between mb-4 mb-sm-0">
        <div className="col-auto">
          <div className="d-flex align-items-center gap-2">
            <span className="xs-small font-weight-normal text-gray-400">
              {t("solution-by")}
            </span>

            <AvatarOrIdenticon
              user={proposal?.deliverable?.user}
              size="xsm"
            />

            <span className="xs-small font-weight-normal text-white">
              {proposal?.deliverable?.user?.handle || truncateAddress(proposal?.deliverable?.user?.address)}
            </span>
          </div>
        </div>

        <ResponsiveEle
          col={"auto"}
          tabletView={
            <DisputeLabel percentage={disputePercentage}/>
          }
        />
      </div>


      <ResponsiveEle
        tabletView={null}
        mobileView={
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <StatusBadge status={status}/>
            </div>

            <div className="col-auto">
              <DisputeLabel percentage={disputePercentage}/>
            </div>
          </div>
        }
      />
    </CardItem>
  );
}