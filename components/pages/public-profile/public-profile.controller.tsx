import React from "react";

import { useRouter } from "next/router";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import CustomContainer from "components/custom-container";
import If from "components/If";
import TasksList from "components/lists/tasks/controller";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";

import { truncateAddress } from "helpers/truncate-address";

import { User } from "interfaces/api";
import { Payment } from "interfaces/payments";

import { PaginatedData, SearchBountiesPaginated } from "types/api";

import useBreakPoint from "x-hooks/use-breakpoint";

interface PublicProfilePageProps {
  user: User;
  payments?: PaginatedData<Payment>;
  tasks?: SearchBountiesPaginated;
}
export default function PublicProfilePage ({
  user,
  payments,
  tasks,
}: PublicProfilePageProps) {
  const { query, asPath, push } = useRouter();
  const { isMobileView, isTabletView } = useBreakPoint();

  const type = query?.type?.toString() || "won";
  const isTabletOrMobile = isMobileView || isTabletView ? true : false;
  const hasHandle = !!user?.handle;
  const truncatedAddress = truncateAddress(user?.address || "");
  const [primaryText, secondaryText] = hasHandle ? [user?.handle, truncatedAddress] : [truncatedAddress, user?.handle];
  const tasksList = type === "won" ? {
    count: payments?.count,
    currentPage: payments?.currentPage,
    pages: payments?.pages,
    rows: payments?.rows?.map(p => p?.issue)
  } : tasks ;
  const tabs = [
    {
      label: "Bounties Won",
      active: !query?.type || query?.type === "won",
      onClick: () => push({
        pathname: asPath,
        query: {
          type: "won"
        }
      }, asPath)
    },
    {
      label: "Submissions",
      active: query?.type === "submissions",
      onClick: () => push({
        pathname: asPath,
        query: {
          type: "submissions"
        }
      }, asPath)
    },
    {
      label: "Proposals",
      active: query?.type === "proposals",
      onClick: () => push({
        pathname: asPath,
        query: {
          type: "proposals"
        }
      }, asPath)
    },
    {
      label: "Bounties Opened",
      active: query?.type === "opened",
      onClick: () => push({
        pathname: asPath,
        query: {
          type: "opened"
        }
      }, asPath)
    },
  ];
  
  return (
    <CustomContainer
      col="col-xs-12 col-xl-12"
      className="mt-4 pt-2 mt-lg-5 pt-lg-2"
    >
      <div className="row align-items-center mb-5">
        <div className="col-auto">
          <AvatarOrIdenticon
            address={user?.address}
            size={isTabletOrMobile ? 56 : "lg"}
            withBorder
          />
        </div>

        <div className="col">
          <div className="row">
            <h1 className="xl-semibold font-weight-medium text-white">
              {primaryText}
            </h1>
          </div>

          <If condition={!!secondaryText}>
            <div className="row">
              <h2 className="sm-regular font-weight-normal text-gray-300">
                {secondaryText}
              </h2>
            </div>
          </If>
        </div>
      </div>

      <div className="row mb-4 pb-1">
        <div className="col">
          <ScrollableTabs
            tabs={tabs}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <TasksList
            bounties={tasksList}
            variant="profile"
            hideTitle
          />
        </div>
      </div>
    </CustomContainer>
  );
}