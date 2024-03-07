import React from "react";

import { useTranslation } from "next-i18next";

import Badge from "components/badge";
import BountyItemLabel from "components/bounty-item-label";
import BountyAmount from "components/bounty/amount-info/controller";
import BountyTagsView from "components/bounty/bounty-tags/view";
import TaskIdTag from "components/bounty/task-id-tag/task-id-tag.view";
import TaskMainInfo from "components/bounty/task-main-info/task-main-info.view";
import TaskTypeBadge from "components/bounty/task-type-badge/task-type-badge.view";
import CardItem from "components/card-item";
import ChainIcon from "components/chain-icon";
import If from "components/If";
import { ResponsiveEle } from "components/responsive-wrapper";
import TaskStatusInfo from "components/task-status-info";
import Translation from "components/translation";

import { TaskListItemVariantProps } from "types/components";

export default function TaskListItemDefault ({
  task,
  onClick,
}: TaskListItemVariantProps) {
  const { t } = useTranslation(["bounty", "common", "custom-network"]);

  return (
    <CardItem onClick={onClick} key="default-card">
      <div className="row align-items-center">
        <div className="col">
          <div className="row align-items-center">
            <div className="col-auto">
              <TaskStatusInfo task={task} />
            </div>

            <div className="col px-0 text-truncate">
              <span className="span">
                {(task?.title !== null && task?.title) || (
                  <Translation ns="bounty" label={"errors.fetching"} />
                )}
              </span>
            </div>

            <div className="col-auto">
              <ChainIcon
                src={task?.network?.chain?.icon}
                label={task?.network?.chain?.chainName}
              />
            </div>
          </div>

          <ResponsiveEle
            tabletView={
              <div className="d-flex justify-content-md-start mt-2 mb-3">
                <BountyTagsView tags={task?.tags}/>

                <If condition={task?.isKyc}>
                  <Badge
                    className={`d-flex status caption-medium py-1 px-3 
                  ms-2 bg-transparent border border-gray-700 text-gray-300`}
                    label={t("bounty:kyc.label")}
                  />
                </If>
              </div>
            }
          />

          <div className="row align-items-center border-xl-top border-gray-850 pt-3">
            <div className="col-12">
              <div className="row">
                <ResponsiveEle
                  col={12}
                  tabletView={
                    <div className="row">
                      <div className="col-12">
                        <div className="row align-items-center justify-content-md-start">
                          <BountyItemLabel label="ID" className="mw-25 col-auto">
                            <TaskIdTag
                              taskId={task?.id}
                              marketplaceName={task?.network?.name}
                            />
                          </BountyItemLabel>

                          <ResponsiveEle
                            col={"auto"}
                            desktopView={
                              <TaskMainInfo task={task}/>
                            }
                          />

                          <BountyItemLabel
                            label={t("info.opened-on")}
                            className="col-auto"
                          >
                      <span className="text-gray text-truncate">
                        {task?.createdAt?.toLocaleDateString("PT")}
                      </span>
                          </BountyItemLabel>

                          <div className="col d-flex justify-content-end px-0">
                            <TaskTypeBadge
                              type={task?.type}
                            />
                          </div>

                          <div className="col-auto d-flex justify-content-end">
                            <BountyAmount bounty={task} size={"lg"}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>

              <ResponsiveEle
                tabletView={null}
                mobileView={
                  <div className="row align-items-center justify-content-between">
                    <div className="col mw-50-auto network-name">
                      <TaskTypeBadge
                        type={task?.type}
                      />
                    </div>

                    <div className="col-auto">
                      <BountyAmount bounty={task} size={"lg"}/>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </CardItem>
  );
}