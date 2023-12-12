import BountyDoneIcon from "assets/icons/bounty-done-icon";
import CanceledIcon from "assets/icons/canceled-icon";
import CircleIcon from "assets/icons/circle-icon";

import { getIssueState } from "helpers/handleTypeIssue";

import { IssueBigNumberData } from "interfaces/issue-data";

interface TaskStatusInfoProps {
  task: IssueBigNumberData;
}

export default function TaskStatusInfo({
  task
}: TaskStatusInfoProps) {
  const issueState = getIssueState({
    state: task?.state,
    amount: task?.amount,
    fundingAmount: task?.fundingAmount,
  });

  const isFunding = !!task?.fundingAmount?.gt(0);
  const isPartialFunded = !!task?.fundedAmount?.gt(0) && !!task?.fundedAmount?.lt(task?.fundingAmount);

  const state = isFunding && isPartialFunded ? "partial-funded" : issueState;

  if (issueState === "closed") return <BountyDoneIcon />;

  if (issueState === "canceled") return <CanceledIcon />;

  return <CircleIcon type={state} />;
}
