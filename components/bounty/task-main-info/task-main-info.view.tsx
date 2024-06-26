import React from "react";

import { useTranslation } from "next-i18next";

import BountyItemLabel from "components/bounty-item-label";

import { formatNumberToString } from "helpers/formatNumber";
import { getIssueState } from "helpers/handleTypeIssue";

import { IssueBigNumberData } from "interfaces/issue-data";

interface TaskMainInfoProps {
  task?: IssueBigNumberData;
}
export default function TaskMainInfo ({
  task
}: TaskMainInfoProps) {
  const { t } = useTranslation("bounty");

  const taskState = getIssueState({
    state: task?.state,
    amount: task?.amount,
    fundingAmount: task?.fundingAmount,
  });

  const types = {
    funding: {
      value: +formatNumberToString(task?.fundedPercent, 2),
      translation: t("info.funded")
    },
    open: {
      value: task?.working?.length,
      translation: t("info.working"),
    },
    ready: {
      value: task?.deliverables?.length,
      translation: t("info.deliverables", {
        count: task?.deliverables?.length,
      }),
    },
    proposal: {
      value: task?.mergeProposals?.length,
      translation: t("info.proposals", {
        count: task?.mergeProposals?.length,
      }),
    },
  };

  const lowerState = taskState?.toLowerCase();

  if (["open", "ready", "proposal", "funding"].includes(lowerState)) {
    const isFunding = lowerState === 'funding';
    const { value, translation } = types[lowerState];

    return (
      <BountyItemLabel label={translation} key={task?.id} className="col-auto">
          <span className={`${ isFunding ? 'text-yellow-500': "text-gray-200"}`}>
            {value || 0}{isFunding && '%'}
          </span>
      </BountyItemLabel>
    );
  } else return <></>;
}