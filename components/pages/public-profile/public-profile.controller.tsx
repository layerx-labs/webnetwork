import React from "react";

import { useRouter } from "next/router";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import CustomContainer from "components/custom-container";
import If from "components/If";
import DeliverablesList from "components/lists/deliverables/deliverables-list.controller";
import ProposalsList from "components/lists/proposals/proposals-list.controller";
import TasksList from "components/lists/tasks/controller";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";

import { truncateAddress } from "helpers/truncate-address";

import { User } from "interfaces/api";

import { DeliverablePaginatedData, ProposalPaginatedData, SearchBountiesPaginated } from "types/api";
import { TasksListItemVariant } from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

interface PublicProfilePageProps {
  user: User;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
}
export default function PublicProfilePage ({
  user,
  tasks,
  deliverables,
  proposals,
}: PublicProfilePageProps) {
  const { query, pathname, asPath, push } = useRouter();
  const { isMobileView, isTabletView } = useBreakPoint();

  const type = query?.type?.toString() || "won";
  const isTaskList = ["won", "opened"].includes(type);
  const isDeliverableList = type === "submissions";
  const isProposalsList = type === "proposals";
  const isTabletOrMobile = isMobileView || isTabletView;
  const hasHandle = !!user?.handle;
  const truncatedAddress = truncateAddress(user?.address || "");
  const [primaryText, secondaryText] = hasHandle ? [user?.handle, truncatedAddress] : [truncatedAddress, user?.handle];
  const listItemVariant = ({
    won: "network",
    opened: "network",
    submissions: "submissions",
    proposals: "proposals"
  }[type] || "network") as TasksListItemVariant;

  const getTab = (label: string, key: string) => ({
    label,
    active: type === key,
    onClick: () => push({
      pathname: pathname,
      query: {
        type: key
      }
    }, asPath)
  });

  const tabs = [
    getTab("Bounties Won", "won"),
    getTab("Submissions", "submissions"),
    getTab("Proposals", "proposals"),
    getTab("Bounties Opened", "opened"),
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
          <If condition={isTaskList}>
            <TasksList
              bounties={tasks}
              variant="profile"
              itemVariant={listItemVariant}
              hideTitle
            />
          </If>

          <If condition={isDeliverableList}>
            <DeliverablesList
              deliverables={deliverables}
            />
          </If>

          <If condition={isProposalsList}>
            <ProposalsList
              proposals={proposals}
            />
          </If>
        </div>
      </div>
    </CustomContainer>
  );
}