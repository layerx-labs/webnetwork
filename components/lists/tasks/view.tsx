import {useTranslation} from "next-i18next";

import Button from "components/button";
import GoTopButton from "components/go-top-button/controller";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import ListSort from "components/lists/sort/controller";
import TasksListFilteredCategories
  from "components/lists/tasks/tasks-list-filtered-categories/tasks-list-filtered-categories.controller";
import TasksListItem from "components/lists/tasks/tasks-list-item/tasks-list-item.controller";
import TasksListsSearchFilters from "components/lists/tasks/tasks-list-search-filters/tasks-list-search-filters.view";
import TasksListsCategoryFilter
  from "components/lists/tasks/tasks-lists-category-filter/tasks-lists-category-filter.controller";
import NothingFound from "components/nothing-found";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";
import ResponsiveWrapper from "components/responsive-wrapper";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { SearchBountiesPaginatedBigNumber } from "types/components";

interface TasksListViewProps {
  bounties?: SearchBountiesPaginatedBigNumber;
  emptyMessage?: string;
  buttonMessage?: string;
  variant: "bounty-hall" | "profile" | "network" | "management";
  type: "bounties" | "deliverables" | "proposals";
  searchString: string;
  isOnNetwork?: boolean;
  isConnected?: boolean;
  hideFilter?: boolean;
  hasFilter?: boolean;
  currentChain?: SupportedChainData;
  chains?: SupportedChainData[];
  filterType?: "category" | "search";
  onClearSearch: () => void;
  onNotFoundClick: () => Promise<void>;
  onNextPage: () => void;
  onSearchInputChange: (event) => void;
  onSearchClick: () => void;
  onEnterPressed: (event) => void;
}

export default function TasksListView({
  emptyMessage,
  buttonMessage,
  variant,
  bounties,
  type,
  searchString,
  isOnNetwork,
  isConnected,
  hasFilter,
  hideFilter,
  onClearSearch,
  onNotFoundClick,
  onNextPage,
  onSearchInputChange,
  onSearchClick,
  onEnterPressed,
  currentChain,
  chains,
  filterType
}: TasksListViewProps) {
  const { t } = useTranslation(["common", "bounty", "deliverable", "proposal"]);

  const isManagement = variant === "management";
  const isProfile = variant === "profile";
  const isBountyHall = variant === "bounty-hall";
  const hasIssues = !!bounties?.count;
  const hasMorePages = hasIssues && bounties?.currentPage < bounties?.pages;
  const showClearButton = searchString?.trim() !== "";
  const showSearchFilter = hasIssues || !hasIssues && hasFilter;
  const variantIssueItem = isManagement ? variant : (isProfile || isBountyHall) ? "multi-network" : "network";
  const isCategoryFilter = filterType === "category";

  const columns = [
    t("bounty:management.name"),
    t("bounty:management.link"),
    t("bounty:management.hide"),
    t("bounty:management.cancel"),
  ];

  const listTitleByType = {
    "bounties": isBountyHall ? t("bounty:all-bounties") : t("bounty:label_other"),
    "deliverables": t("deliverable:label_other"),
    "proposals": t("proposal:label_other")
  };

  const sortOptions = [
    {
      value: "newest",
      sortBy: "createdAt",
      order: "DESC",
      label: t("sort.types.newest")
    },
    {
      value: "oldest",
      sortBy: "createdAt",
      order: "ASC",
      label: t("sort.types.oldest")
    },
    {
      value: "highest-bounty",
      sortBy: "amount,fundingAmount",
      order: "DESC",
      label: t("sort.types.highest-bounty")
    },
    {
      value: "lowest-bounty",
      sortBy: "amount,fundingAmount",
      order: "ASC",
      label: t("sort.types.lowest-bounty")
    }
  ];

  function CountComponent({ count }: { count?: number }) {
    return (
      <span className="p family-Regular text-gray-400 bg-gray-850 border-radius-4 p-1 px-2">
        {count || 0}
      </span>
    );
  }

  return (
    <>
      <div className="row mb-4">
        <div className="col">
          <If condition={isCategoryFilter}>
            <TasksListsCategoryFilter />
          </If>

          <If condition={isBountyHall || isProfile || isManagement}>
            <div className={`d-flex flex-wrap justify-content-between ${isCategoryFilter ? "mb-3" : ""}`}>
              <div className="d-flex flex-row flex-wrap align-items-center gap-2">
                <div className="d-flex gap-2 align-items-center">
                  <h4 className="text-capitalize font-weight-medium">
                    {listTitleByType[type]}
                  </h4>
                  {["deliverables", "proposals"].includes(type) ? (
                    <>
                      <CountComponent count={bounties?.totalBounties} />
                      <span className="caption-small text-gray font-weight-medium mt-1">
                      {t("bounty:label", { count: bounties?.count })}{" "}
                        {bounties?.count}
                    </span>
                    </>
                  ) : (
                    <CountComponent count={bounties?.totalBounties} />
                  )}
                </div>
              </div>

              <If condition={isProfile && isOnNetwork}>
                <ResponsiveWrapper md={false} xs={true} sm={true}>
                  <div className="d-flex align-items-center">
                    <div
                      className={`d-flex py-1 pe-2 justify-content-center text-truncate border border-gray-800
                          border-radius-4 text-white-40 bg-gray-850 text-uppercase`}
                    >
                      <div className="d-flex flex-column justify-content-center">
                        <div
                          className="d-flex ball mx-2"
                          style={{
                            backgroundColor: currentChain?.color,
                          }}
                        />
                      </div>
                      {currentChain?.chainShortName}
                    </div>
                  </div>
                </ResponsiveWrapper>
              </If>
            </div>
          </If>

          <If condition={showSearchFilter}>
            <TasksListsSearchFilters
              isManagement={isManagement}
              isProfile={isProfile}
              isOnNetwork={isOnNetwork}
              isBountyHall={isBountyHall}
              hideFilter={hideFilter || isBountyHall}
              sortOptions={sortOptions}
              chains={chains}
              searchString={searchString}
              placeholder={t("bounty:search")}
              hasFilter={showClearButton}
              onSearchClick={onSearchClick}
              onSearchInputChange={onSearchInputChange}
              onEnterPressed={onEnterPressed}
              onClearSearch={onClearSearch}
            />
          </If>

          <If condition={isCategoryFilter}>
            <TasksListFilteredCategories />
          </If>

          <If condition={isManagement && hasIssues}>
            <ResponsiveWrapper
              xs={false}
              md={true}
              className="row align-items-center mb-2 pb-1 px-3"
            >
              {columns?.map((item) => (
                <div
                  className={`d-flex col-${
                    item === "Name" ? "6" : "2 justify-content-center"
                  }`}
                  key={item}
                >
                  <span className="caption-medium font-weight-normal text-capitalize text-gray-500">{item}</span>
                </div>
              ))}
            </ResponsiveWrapper>
          </If>

          <If
            condition={hasIssues}
            otherwise={
              <div className="pt-4">
                <NothingFound description={emptyMessage || t("filters.bounties.not-found")}>
                  {(isConnected && !isBountyHall && !isManagement) && (
                    <ReadOnlyButtonWrapper>
                      <Button onClick={onNotFoundClick} data-testid="create-one-btn">
                        {buttonMessage || String(t("actions.create-one"))}
                      </Button>
                    </ReadOnlyButtonWrapper>
                  )}
                </NothingFound>
              </div>
            }
          >
            <InfiniteScroll
              handleNewPage={onNextPage}
              hasMore={hasMorePages}
              className="row gy-3 gx-3"
            >
              {bounties?.rows?.map((issue) => (
                <div
                  className={isBountyHall ? "col-12 col-lg-6" : "col-12"}
                  key={`issue-list-item-${issue.id}`}
                  data-testid={`issue-list-item-${issue.id}`}
                >
                  <TasksListItem issue={issue} variant={variantIssueItem} />
                </div>
              ))}
            </InfiniteScroll>
          </If>
        </div>
      </div>
      <GoTopButton />
    </>
  );
}
