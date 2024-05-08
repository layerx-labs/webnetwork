import React from "react";

import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import ReviewsNumberView from "components/bounty/tabs-sections/reviews-number.view";
import Button from "components/button";
import { IPRLabel } from "components/deliverable/labels/controller";
import If from "components/If";
import ProposalProgressSmall from "components/proposal-progress-small";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";
import Translation from "components/translation";

import { Deliverable } from "interfaces/issue-data";
import { Proposal } from "interfaces/proposal";

interface ItemRowProps {
  isProposal: boolean;
  item: Proposal | Deliverable;
  handleBtn: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  btnLabel: string;
  proposal: Proposal;
  isDisputed: boolean;
  isMerged: boolean;
  totalToBeDisputed: BigNumber;
  status?: IPRLabel[];
  isRefused?: boolean;
  isPrivate?: boolean;
}

export default function ProposalOrDeliverableView({
  isProposal,
  item,
  handleBtn,
  btnLabel,
  proposal,
  isDisputed,
  isMerged,
  totalToBeDisputed,
  isRefused,
  isPrivate
}: ItemRowProps) {
  const { t } = useTranslation(["proposal", "deliverable", "common"]);
  return (
    <>
      <If 
        condition={!!isProposal && !!proposal}
        otherwise={
          <ReviewsNumberView
            className="d-none d-xl-block"
            reviewers={(item as Deliverable)?.comments?.filter(e => e.type === 'review')?.length || 0}
          />
        }
      >
        <div className="d-flex align-items-center text-center col-md-8">
          <ProposalProgressSmall
            color={isDisputed || isRefused ? "danger" : isMerged ? "success" : "purple"}
            value={proposal?.disputeWeight}
            total={totalToBeDisputed}
          />
        </div>
      </If>

      <If condition={!isPrivate}>
        <ReadOnlyButtonWrapper>
          <div className="row align-items-center d-none d-xl-block">
            <div className="d-flex">
              <Button
                className="read-only-button text-truncate ms-1"
                onClick={handleBtn}
                data-testid={t(btnLabel)}
              >
                <span className="label-m text-white">
                  <Translation label={btnLabel} />
                </span>
              </Button>
            </div>
          </div>
        </ReadOnlyButtonWrapper>
      </If>
    </>
  );
}
