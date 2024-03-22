import React from "react";

import BigNumber from "bignumber.js";
import Link from "next/link";
import {UrlObject} from "url";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import ItemRowIdView from "components/bounty/tabs-sections/item-row/id.view";
import ItemRowLabelsView from "components/bounty/tabs-sections/item-row/labels.view";
import ProposalOrDeliverableView from "components/bounty/tabs-sections/item-row/proposal-or-deliverable.view";
import ReviewsNumberView from "components/bounty/tabs-sections/reviews-number.view";
import { UserProfileLink } from "components/common/user-profile-link/user-profile-link.view";
import {IPRLabel} from "components/deliverable/labels/controller";
import If from "components/If";
import Translation from "components/translation";

import {Deliverable} from "interfaces/issue-data";
import {Proposal} from "interfaces/proposal";

interface ItemRowProps {
  id: string | number;
  status?: IPRLabel[];
  href?: UrlObject | string;
  isProposal?: boolean;
  item: Proposal | Deliverable;
  handleBtn: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  btnLabel: string;
  proposal: Proposal;
  isDisputed: boolean;
  isMerged: boolean;
  totalToBeDisputed: BigNumber;
  isRefused?: boolean;
}

export default function ItemRowView({
  id,
  status,
  href,
  isProposal,
  item,
  handleBtn,
  btnLabel,
  proposal,
  isDisputed,
  isMerged,
  totalToBeDisputed,
  isRefused
}: ItemRowProps) {
  const userhandle = (item as Deliverable)?.user?.handle;
  const userAddress = (item as Deliverable)?.user?.address || (item as Proposal)?.creator;

  function RenderProposalOrDeliverable() {
    return (
      <ProposalOrDeliverableView
        handleBtn={handleBtn}
        btnLabel={btnLabel}
        proposal={proposal}
        isDisputed={isDisputed}
        isRefused={isRefused}
        isMerged={isMerged}
        totalToBeDisputed={totalToBeDisputed} 
        isProposal={isProposal} 
        item={item}      
        status={status}
        />
    );
  }

  return (
    <Link passHref key={`${id}`} data-testid={`item-${id}`} href={href || "#"}>
      <div
        className={`row d-flex flex-row py-3 px-2 border-radius-8 bg-gray-900 align-items-center ${
          href ? "cursor-pointer" : ""
        }`}
        data-testid={isProposal ? "proposal-item-row" : "deliverable-item-row"}
      >
        <div className="col-10 col-md-8 d-flex flex-row align-items-center gap-3">
          <ItemRowIdView id={id} className="col-1 d-none d-xl-block" />

          <div className="text-truncate col-md-5 col-xl-3 d-flex align-items-center gap-2">
            <AvatarOrIdenticon
              user={userhandle}
              address={userAddress}
              size="sm"
            />

            <UserProfileLink
              className={`${
                isProposal ? "d-none d-sm-block" : ""
              } text-uppercase text-white caption text-truncate mt-1`}
              address={userAddress}
              handle={userhandle}
            />
          </div>

          <If condition={isProposal}>
            <div className="col-md-3 col-xl-3 mgt-3">
              <span className="text-uppercase caption text-gray-500">
                <Translation label={"deliverable:label"} /> #{(item as Proposal)?.deliverableId}
              </span>
            </div>
          </If>

          <If condition={!isProposal}>
            <ReviewsNumberView
              reviewers={(item as Deliverable)?.comments?.length || 0}
              className="col-xs-12 d-xl-none d-none d-sm-block"
            />
          </If>

          <ItemRowLabelsView key='label-normal-screen' status={status} className="d-none d-sm-block" />
        </div>

        <div className="col-1 d-block d-sm-none ms-2">
          <div className="d-flex flex-row justify-content-end">
            <ItemRowIdView id={id} />
          </div>
        </div>

        <If condition={!isProposal}>
          <ReviewsNumberView
            reviewers={(item as Deliverable)?.comments?.filter(e => e.type === 'review')?.length || 0}
            className="d-block d-sm-none mb-2 mt-4"
          />
        </If>

        <If 
          condition={!!status?.length}
          otherwise={
            <div className="d-block d-sm-none mt-3">
              <RenderProposalOrDeliverable />
            </div>
          }
        >
          <ItemRowLabelsView
            key='label-tablet-mobile'
            status={status}
            className="d-block d-sm-none mt-2"
            classLabels="p-2"
          />
        </If>

        <div className="col-lg-4 col-md d-none d-sm-block">
          <div className="d-flex flex-row gap-3 justify-content-end align-items-center">
            <RenderProposalOrDeliverable />

            <ItemRowIdView
              id={id}
              className="d-none d-xl-none d-sm-none d-md-block"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
