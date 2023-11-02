import {useEffect, useState} from "react";

import {useTranslation} from "next-i18next";

import {useAppState} from "contexts/app-state";

import {formatNumberToNScale} from "helpers/formatNumber";

import { useNetwork } from "x-hooks/use-network";

import TokenSymbolView from "./common/token-symbol/view";

export default function ProposalProgressBar({
  isDisputed = null,
  issueDisputeAmount = 0,
  isFinished = false,
  isMerged = false,
  refused = false,
  disputeMaxAmount = 0,
  isAbleToDispute = false,
}) {
  const { t } = useTranslation("proposal");

  const [issueState, setIssueState] = useState<string>("");
  const [issueColor, setIssueColor] = useState<string>("");
  const [percentage, setPercentage] = useState<number>(0);
  const [_columns, setColumns] = useState<number[]>([]);
  
  const { state } = useAppState();
  const { getTotalNetworkToken } = useNetwork();
  const { data: totalNetworkToken } = getTotalNetworkToken();

  function toPercent(value = 0, total = 0, decimals = 2) {
    const percent = +((value / total) * 100).toFixed(decimals)
    return isNaN(percent) ? 0 : percent;
  }

  function toRepresentationPercent(value = 0) {
    return value > disputeMaxAmount ? 100 : ((value * 110) / disputeMaxAmount) / 1.8; // trust.
  }

  function getStateColor() {
    if (isDisputed || refused || (!isMerged && isFinished === true)) return "danger";

    if (isDisputed === false && isFinished === true && isMerged)
      return "success";

    if (isDisputed === false) return "purple";

    return "white-50";
  }

  function getStateText() {
    if (refused) return t("status.refused");
    
    if (isDisputed === true || (!isMerged && isFinished === true))
      return t("status.failed");

    if (isDisputed === false && isFinished === false && isAbleToDispute) return t("status.open-for-dispute");

    if (isDisputed === false && isFinished === true && isMerged)
      return t("status.accepted");

    return t("status.waiting");
  }

  function loadDisputeState() {
    setIssueState(getStateText());
    setIssueColor(getStateColor());
    setPercentage(+toPercent(issueDisputeAmount, +totalNetworkToken?.toFixed() || 0));
  }

  function renderColumn(dotLabel, index) {
    const isLastColumn = index + 1 === _columns.length;

    const dotClass = [
      `rounded-circle`,
      !percentage || dotLabel > percentage ? `empty-dot` : `bg-${issueColor}`
    ].join(` `);

    const captionClass = [
      `caption mt-4 ms-1 font-weight-medium`,
      isLastColumn ? `text-${issueColor}` : "text-white"
    ].join(` `)

    const style = { left: index === 0 ? "1%" : `${index * 20}%` };
    const dotStyle = { width: "10px", height: "10px" };

    const label = `${isLastColumn && `>` || ``} ${dotLabel}%`;

    return (
      <div key={`ppb-${index}`}
           className="position-absolute d-flex align-items-center flex-column"
           style={style}>
        <div className={dotClass} style={dotStyle}>
          <div className={captionClass}>{label}</div>
        </div>
      </div>
    );
  }

  function createColumn() {
    if (!disputeMaxAmount)
      return;

    const floorIt = (value, zeroes = 10**2) => Math.floor(value * zeroes) / zeroes;
    const incrementor = floorIt(disputeMaxAmount / 3);
    const dynamicColumns = [...Array(4)].map((_, i) => floorIt(i * incrementor));
    setColumns([...dynamicColumns, disputeMaxAmount]);
  }

  useEffect(loadDisputeState, [
    state.currentUser?.balance?.staked,
    issueDisputeAmount,
    isDisputed,
    isFinished,
    refused,
    isMerged,
  ]);

  useEffect(createColumn, [disputeMaxAmount]);

  return (
    <>
      <div className="row mb-2 proposal-progress-bar align-items-center">
        <div className="col-12 col-xl-6 mb-3">
          <h4 className={`caption-large text-uppercase text-${issueColor}`}>
            {issueState}
          </h4>
        </div>

        <div className="col-12 col-xl-6 mb-3">
          <div className="d-flex justify-content-xl-end caption-small align-items-center text-truncate">
            <span className={`text-${issueColor} text-uppercase`}>
              {formatNumberToNScale(issueDisputeAmount)}{" "}
            </span>{" "}
            <span className="me-1">/{formatNumberToNScale(totalNetworkToken?.toFixed() || 0)}{" "}</span>
            <TokenSymbolView 
              name={t("common:$oracles", { token: state.Service?.network?.active?.networkToken?.symbol })}
            />
             {" "}
            <span className={`text-${issueColor}`}> ({percentage}%)</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ms-1 col-12 position-relative">
          <div className={`progress bg-${issueColor}`}>
            <div
              className={`progress-bar bg-${issueColor}`}
              role="progressbar"
              style={{ width: `${toRepresentationPercent(percentage)}%` }}>
              {_columns.map(renderColumn)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
