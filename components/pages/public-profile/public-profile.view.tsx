import AvatarOrIdenticon from "components/avatar-or-identicon";
import CustomContainer from "components/custom-container";
import If from "components/If";
import DeliverablesList from "components/lists/deliverables/deliverables-list.controller";
import ProposalsList from "components/lists/proposals/proposals-list.controller";
import TasksList from "components/lists/tasks/controller";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";


import { DeliverablePaginatedData, ProposalPaginatedData, SearchBountiesPaginated } from "types/api";
import { MiniTabsItem, TasksListItemVariant } from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

interface PublicProfileViewProps {
  userAddress: string;
  primaryText: string;
  secondaryText?: string;
  tabs: MiniTabsItem[];
  isTaskList?: boolean;
  isDeliverableList?: boolean;
  isProposalsList?: boolean;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
  type?: string;
}

export default function PublicProfileView ({
  userAddress,
  primaryText,
  secondaryText,
  tabs,
  isTaskList,
  isDeliverableList,
  isProposalsList,
  tasks,
  deliverables,
  proposals,
  type = "won"
}: PublicProfileViewProps) {
  const { isMobileView, isTabletView } = useBreakPoint();

  const isTabletOrMobile = isMobileView || isTabletView;
  const listItemVariant = ({
    won: "network",
    opened: "network",
    submissions: "submissions",
    proposals: "proposals"
  }[type] || "network") as TasksListItemVariant;

  return (
    <CustomContainer
      col="col-xs-12 col-xl-12"
      className="mt-4 pt-2 mt-lg-5 pt-lg-2"
    >
      <div className="row align-items-center mb-5">
        <div className="col-auto">
          <AvatarOrIdenticon
            address={userAddress}
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