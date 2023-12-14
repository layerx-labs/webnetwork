import React from "react";

import { useTranslation } from "next-i18next";

import BountyItemLabel from "components/bounty-item-label";
import BountyAmount from "components/bounty/amount-info/controller";
import TaskMainInfo from "components/bounty/task-main-info/task-main-info.view";
import TaskStatusBadge from "components/bounty/task-status-badge/task-status-badge.view";
import TaskTypeBadge from "components/bounty/task-type-badge/task-type-badge.view";
import MarketplaceWithNetworkLogo
  from "components/common/marketplace-with-network-logo/marketplace-with-network-logo.view";

import { IssueBigNumberData } from "interfaces/issue-data";

interface TasksListItemTaskHallProps {
  task: IssueBigNumberData;
  onClick?: () => void;
}
export default function TasksListItemTaskHall ({
  task,
  onClick
}: TasksListItemTaskHallProps) {
  const { t } = useTranslation("bounty");

  return(
    <div
      className="row align-items-center mx-0 p-3 bg-gray-900 border border-gray-800 border-radius-8 cursor-pointer"
      onClick={onClick}
      role="link"
    >
      <div className="col p-0">
        <div className="row align-items-center mb-4">
          <div className="col-auto">
            <MarketplaceWithNetworkLogo
              networkLogo={task?.network?.chain?.icon}
              marketplaceLogo={task?.network?.logoIcon}
            />
          </div>

          <div className="col sm-regular text-white two-lines-text">
            {task?.title}
          </div>
        </div>

        <div className="row align-items-center border-lg-bottom border-gray-850 mx-0 gap-2 gap-lg-4 pb-lg-3">
          <div className="col-auto px-0">
            <TaskStatusBadge task={task} />
          </div>

          <div className="col col-lg-auto px-0">
            <TaskTypeBadge
              type={task?.type}
            />
          </div>

          <div className="col-auto px-0 d-flex d-lg-none">
            <BountyAmount bounty={task} size={"lg"} />
          </div>
        </div>

        <div className="row align-items-center mt-3 d-none d-lg-flex">
          <TaskMainInfo task={task} />

          <div className="col text-truncate">
            <BountyItemLabel
              label={t("info.opened-on")}
            >
              <span className="text-gray">
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