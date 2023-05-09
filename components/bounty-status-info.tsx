import React from "react";

import BountyDoneIcon from "assets/icons/bounty-done-icon";
import CanceledIcon from "assets/icons/canceled-icon";
import CircleIcon from "assets/icons/circle-icon";

import { IssueState } from "interfaces/issue-data";

interface IBountyStatusInfo {
  issueState: IssueState;
}

export default function BountyStatusInfo({ issueState }: IBountyStatusInfo) {
  if (issueState === "closed") return <BountyDoneIcon />;

  if (issueState === "canceled") return <CanceledIcon />;

  return <CircleIcon type={issueState} />;
}
