import React from "react";

import { useTranslation } from "next-i18next";

import BountyItemLabel from "components/bounty-item-label";
import BountyAmount from "components/bounty/amount-info/controller";
import TaskMainInfo from "components/bounty/task-main-info/task-main-info.view";
import TaskStatusBadge from "components/bounty/task-status-badge/task-status-badge.view";
import TaskTypeBadge from "components/bounty/task-type-badge/task-type-badge.view";
import ChainIcon from "components/chain-icon";
import MarketplaceWithNetworkLogo 
  from "components/common/marketplace-with-network-logo/marketplace-with-network-logo.view";
import If from "components/If";
import { SubscriptionTaskButton }
  from "components/notifications/subscription-task-button/subscription-task-button.controller";

import { TaskListItemVariantProps } from "types/components";

export default function TaskListItemDefault({
  task,
  isMarketplaceList,
  onClick,
}: TaskListItemVariantProps) {
  const { t } = useTranslation(["bounty", "common", "custom-network"]);

  return(
    <div
      className="row align-items-center mx-0 p-3 bg-gray-900 border border-gray-800 border-radius-8 cursor-pointer"
      onClick={onClick}
      role="link"
    >
      <div className="col p-0">
        <div className="row gap-1 align-items-center mb-4 pb-2">
          <div className="col-auto">
            <If
              condition={isMarketplaceList}
              otherwise={
                <MarketplaceWithNetworkLogo
                  networkLogo={task?.network?.chain?.icon}
                  marketplaceLogo={task?.network?.logoIcon}
                />
              }
            >
              <div className="rounded-circle border border-2 border-gray-800">
                <ChainIcon
                  src={task?.network?.chain?.icon}
                  size="24"
                />
              </div>
            </If>
            
          </div>

          <div className="col sm-regular text-white two-lines-text capitalize-first px-0">
            {task?.title}
          </div>

          <div className="col-auto">
            <SubscriptionTaskButton
              taskId={+task?.id}
              variant="icon"
            />
          </div>
        </div>

        <div className="row align-items-center border-sm-bottom border-gray-850 mx-0 gap-2 gap-sm-3 pb-sm-3">
          <div className="col-auto px-0">
            <TaskStatusBadge task={task} />
          </div>

          <div className="col col-sm-auto px-0">
            <TaskTypeBadge
              type={task?.type}
            />
          </div>

          <div className="col-auto px-0 d-flex d-sm-none">
            <BountyAmount bounty={task} size={"lg"} />
          </div>
        </div>

        <div className="row align-items-center gap-2 mt-3 d-none d-sm-flex">
          <TaskMainInfo task={task} />

          <div className="col text-truncate">
            <BountyItemLabel
              label={t("info.opened-on")}
            >
              <span className="text-gray-200 sm-regular">
                {task?.createdAt?.toLocaleDateString("PT")}
              </span>
            </BountyItemLabel>
          </div>

          <div className="col-auto">
            <BountyAmount bounty={task} size={"lg"} />
          </div>
        </div>
      </div>
    </div>
  );
}