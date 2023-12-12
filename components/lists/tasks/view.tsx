import {FormControl, InputGroup} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import CloseIcon from "assets/icons/close-icon";
import SearchIcon from "assets/icons/search-icon";

import SelectNetwork from "components/bounties/select-network";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import GoTopButton from "components/go-top-button/controller";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import IssueFilters from "components/issue-filters";
import ChainFilter from "components/lists/filters/chain/controller";
import ListSort from "components/lists/sort/controller";
import TasksListItem from "components/lists/tasks/task-item/task-list-item.controller";
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
  chains
}: TasksListViewProps) {
  const { t } = useTranslation(["common", "bounty", "deliverable", "proposal"]);

  const isManagement = variant === "management";
  const isProfile = variant === "profile";
  const isBountyHall = variant === "bounty-hall";
  const hasIssues = !!bounties?.count;
  const hasMorePages = hasIssues && bounties?.currentPage < bounties?.pages;
  const showClearButton = searchString?.trim() !== "";
  const showSearchFilter = hasIssues || !hasIssues && hasFilter;
  const variantIssueItem = isManagement ? variant : (isProfile || isBountyHall) ? "multi-network" : "network"

  const columns = [
    t("bounty:management.name"),
    t("bounty:management.link"),
    t("bounty:management.hide"),
    t("bounty:management.cancel"),
  ];

  const listTitleByType = {
    "bounties": t("bounty:label_other"),
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
    <div className="px-0 mx-0 mb-4">
      <If condition={isBountyHall || isProfile || isManagement}>
        <div className="d-flex flex-wrap justify-content-between">
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
                <CountComponent count={bounties?.count} />
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
        <div
          className={"row align-items-center list-actions sticky-top bg-body"}
        >
          <div className="col">
            <InputGroup className="border-radius-4">
              <InputGroup.Text className="cursor-pointer" onClick={onSearchClick}>
                <SearchIcon />
              </InputGroup.Text>

              <FormControl
                value={searchString}
                onChange={onSearchInputChange}
                className="p-2"
                placeholder={t("bounty:search")}
                onKeyDown={onEnterPressed}
              />

              <If condition={showClearButton}>
                <button
                  className="btn bg-gray-850 border-0 py-0 px-3"
                  onClick={onClearSearch}
                >
                  <CloseIcon width={10} height={10} />
                </button>
              </If>
            </InputGroup>
          </div>

          <ResponsiveWrapper xs={isManagement} xl={true} className="col-auto">
            <ListSort options={sortOptions} />
          </ResponsiveWrapper>

          <If condition={!hideFilter && (!isManagement || isProfile)}>
            <div className="col-auto">
              <If condition={!isManagement}>
              <IssueFilters
                  sortOptions={sortOptions}
                  onlyProfileFilters={isProfile}
                  chains={isProfile ? chains : null}
                />
              </If>

              <div className="d-none d-xl-flex">
                <If condition={isProfile}>
                <SelectNetwork
                    isCurrentDefault={isProfile && isOnNetwork}
                    filterByConnectedChain={isOnNetwork ? true : false}
                  />
                  <div className="d-flex align-items-center ms-3">
                    <label className="caption-small font-weight-medium text-gray-100 text-nowrap mr-1">
                      {t("misc.chain")}
                    </label>
                    <ChainFilter chains={chains} label={false} />
                  </div>
                </If>
              </div>
            </div>
          </If>
        </div>
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
                  <ContractButton onClick={onNotFoundClick}>
                    {buttonMessage || String(t("actions.create-one"))}
                  </ContractButton>
                  </ReadOnlyButtonWrapper>
                )}
            </NothingFound>
          </div>
        }
      >
        <InfiniteScroll
          handleNewPage={onNextPage}
          hasMore={hasMorePages}
        >
          {bounties?.rows?.map(issue => 
              <TasksListItem
                issue={issue}
                key={`issue-list-item-${issue.id}`}
                variant={variantIssueItem}
              />)}
        </InfiniteScroll>
      </If>
      <GoTopButton />
    </div>
  );
}