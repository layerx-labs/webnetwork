import { useTranslation } from "next-i18next";

import Badge from "components/badge";
import BountyAmount from "components/bounty/amount-info/controller";
import CardItem from "components/card-item";
import If from "components/If";
import NetworkBadge from "components/network/badge/view";
import { ResponsiveEle } from "components/responsive-wrapper";
import TaskStatusInfo from "components/task-status-info";

import { formatNumberToCurrency } from "helpers/formatNumber";
import { getIssueState } from "helpers/handleTypeIssue";

import { TaskListItemVariantProps } from "types/components";

import { useSettings } from "x-hooks/use-settings";

export default function TaskListItemSmall ({
  task,
  onClick,
}: TaskListItemVariantProps) {
  const { t } = useTranslation(["bounty", "common", "custom-network"]);

  const { settings } = useSettings();

  const issueState = getIssueState({
    state: task?.state,
    amount: task?.amount,
    fundingAmount: task?.fundingAmount,
  });
  const isSeekingFund = ["funding", "partial-funded"].includes(issueState);

  return (
    <CardItem onClick={onClick} key="sm-card">
      <>
        <ResponsiveEle
          tabletView={
            <div className="d-flex gap-2 align-items-center justify-content-between">
              <div className="mw-50-auto network-name">
                <NetworkBadge
                  logoUrl={task?.network?.logoIcon && `${settings?.urls?.ipfs}/${task?.network?.logoIcon}`}
                  name={task?.network?.name}
                />
              </div>

              <div className="max-width-content">
                <Badge
                  color="transparent"
                  className={`d-flex align-items-center gap-1 border border-gray-800 caption-medium 
                  font-weight-normal text-capitalize border-radius-8`}
                >
                  <>
                    <TaskStatusInfo task={task}/>
                    <span>{isSeekingFund ? t("seeking-funding") : issueState}</span>
                  </>
                </Badge>
              </div>
            </div>
          }
        />

        <ResponsiveEle
          tabletView={null}
          mobileView={
            <div className="align-items-center gap-2 mb-3">
              <TaskStatusInfo task={task}/>
              <span className="text-truncate text-capitalize">{task?.title}</span>
            </div>
          }
        />

        <ResponsiveEle
          tabletView={
            <div className="mt-3 flex-column">
              <span className="text-white text-truncate text-capitalize">
                {task?.title}
              </span>

              <span className="text-gray-600 text-truncate text-capitalize">
                {task?.body}
              </span>
            </div>
          }
        />

        <div className="row align-items-center justify-content-md-end justify-content-between mt-2">
          <If condition={isSeekingFund}>
            <ResponsiveEle
              tabletView={
                <div className="col-6 caption-medium font-weight-normal text-capitalize">
                  <span className="mr-1">{t("info.funded")}</span>
                  <span className="text-yellow-500">{formatNumberToCurrency(task?.fundedPercent)}%</span>
                </div>
              }
            />
          </If>

          <ResponsiveEle
            tabletView={null}
            mobileView={
              <div className="mw-50-auto network-name caption-medium font-weight-normal text-capitalize">
                <NetworkBadge
                  logoUrl={task?.network?.logoIcon && `${settings?.urls?.ipfs}/${task?.network?.logoIcon}`}
                  name={task?.network?.name}
                />
              </div>
            }
          />

          <div className="col-6">
            <BountyAmount bounty={task} size={"sm"} />
          </div>
        </div>
      </>
    </CardItem>
  );
}