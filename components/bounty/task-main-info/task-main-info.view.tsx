import React from "react";

import { useTranslation } from "next-i18next";

import BountyItemLabel from "components/bounty-item-label";

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
      value: task?.fundedPercent,
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
          <span className={`${ isFunding ? 'text-light-warning': "text-gray"}`}>
            {value || 0}{isFunding && '%'}
          </span>
      </BountyItemLabel>
    );
  } else return <></>;
}