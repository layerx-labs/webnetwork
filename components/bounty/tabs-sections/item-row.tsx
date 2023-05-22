import React from "react";

import Link from "next/link";
import { UrlObject } from "url";

import Avatar from "components/avatar";
import Identicon from "components/identicon";
import PullRequestLabels, { IPRLabel } from "components/pull-request-labels";

import { truncateAddress } from "helpers/truncate-address";

import ReviewsNumber from "./reviews-number";

interface ItemRowProps {
  id: string | number;
  githubLogin?: string;
  creator?: string;
  status?: IPRLabel[];
  children?: React.ReactNode;
  href?: UrlObject | string;
  reviewers?: number;
  isProposal?: boolean;
}

function ItemRow({ id, githubLogin, creator, status, children, href, reviewers, isProposal }: ItemRowProps) {

  function RenderId({ className }: { className?: string}) {
    return (
      <div className={className}>
        <span className="label-m text-gray-500">#{id}</span>
      </div>
    );
  }

  function RenderLabels({ className, classLabels }: { className?: string, classLabels?: string}) {
    return (
      <div className={`${className} col-md-4 d-flex gap-2`}>
        {status?.length
          ? status.map((st) => <PullRequestLabels {...st} className={classLabels}/>)
          : null}
      </div>
    )
  }


  return (
    <Link passHref key={`${githubLogin}-${id}`} href={href || "#"}>
      <div
        className={`row d-flex flex-row py-3 px-2 border-radius-8 bg-gray-900 align-items-center ${
          href ? "cursor-pointer" : ""
        }`}
      >
        <div className="col-10 col-md-8 d-flex flex-row align-items-center gap-3">
          <RenderId className="col-1 d-none d-xl-block" />
          <div className="text-truncate col-md-5 col-xl-4 d-flex align-items-center gap-2">
          {githubLogin ? (
              <>
                <Avatar userLogin={githubLogin} size="sm"/>
                <span className={`text-uppercase text-white caption text-truncate`}>
                  {githubLogin}
                </span>
              </>
            ) : (
              <>
              <Identicon size="sm" address={creator} className="mx-1"/>
              <span className={`text-uppercase text-white caption`}>
                {truncateAddress(creator)}
              </span>
              </>
            )}
          </div>
          {!isProposal && <ReviewsNumber reviewers={reviewers} className="col-xs-12 d-xl-none d-none d-sm-block" />}
          <RenderLabels className="d-none d-sm-block"/>

        </div>
        <div className="col-1 d-block d-sm-none ms-2">
          <div className="d-flex flex-row justify-content-end">
            <RenderId />
          </div>
        </div>

        {!isProposal && <ReviewsNumber reviewers={reviewers} className="d-block d-sm-none mb-2 mt-4" />} 

        {status?.length ? (
          <RenderLabels className="d-block d-sm-none mt-2" classLabels="p-2" />
        ) : (
          <div className="d-block d-sm-none mt-3">{children}</div>
        )}

        <div className="col-md d-none d-sm-block">
          <div className=" d-flex flex-row gap-3 justify-content-end align-items-center">
            {children}
            <RenderId className="d-none d-xl-none d-sm-none d-md-block" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ItemRow;
