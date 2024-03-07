import { useTranslation } from "next-i18next";

import Badge from "components/badge";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import TaskStatusInfo from "components/task-status-info";

import { getIssueState } from "helpers/handleTypeIssue";

import { IssueBigNumberData } from "interfaces/issue-data";

interface TaskStatusBadgeProps {
  task: IssueBigNumberData;
}
export default function TaskStatusBadge ({ task }: TaskStatusBadgeProps) {
  const { t } = useTranslation("bounty");

  const issueState = getIssueState({
    state: task?.state,
    amount: task?.amount,
    fundingAmount: task?.fundingAmount,
  });
  
  return(
    <Tooltip tip={t(`tips.status.${issueState}`)}>
      <Badge
        color="transparent"
        className={`d-flex px-2 py-1 align-items-center gap-1 border border-gray-800 caption-medium 
                    font-weight-normal text-capitalize border-radius-4`}
      >
        <TaskStatusInfo task={task} />
        <span>{t(`status.${issueState}`)}</span>
      </Badge>
    </Tooltip>
  );
}