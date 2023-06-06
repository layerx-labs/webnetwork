import React, {useEffect, useState} from "react";
import {FormControl, InputGroup} from "react-bootstrap";

import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {UrlObject} from "url";
import { useDebouncedCallback } from "use-debounce";

import CloseIcon from "assets/icons/close-icon";
import SearchIcon from "assets/icons/search-icon";

import SelectNetwork from "components/bounties/select-network";
import ContractButton from "components/contract-button";
import CustomContainer from "components/custom-container";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import IssueFilters from "components/issue-filters";
import IssueListItem from "components/issue-list-item";
import ListSort from "components/list-sort";
import NothingFound from "components/nothing-found";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";
import ScrollTopButton from "components/scroll-top-button";

import {useAppState} from "contexts/app-state";

import { issueParser } from "helpers/issue";

import { SearchBountiesPaginated } from "types/api";

import usePage from "x-hooks/use-page";
import useSearch from "x-hooks/use-search";

type Filter = {
  label: string;
  value: string;
  emptyState: string;
};

type FiltersByIssueState = Filter[];

interface ListIssuesProps {
  bounties?: SearchBountiesPaginated;
  redirect?: string | UrlObject;
  emptyMessage?: string;
  buttonMessage?: string;
  inView?: boolean;
  variant?: "bounty-hall" | "profile" | "network" | "management"
  type?: "bounties" | "pull-requests" | "proposals";
}

export default function ListIssues({
  emptyMessage,
  buttonMessage,
  redirect,
  inView,
  variant = "network",
  bounties,
  type = "bounties"
}: ListIssuesProps) {
  const router = useRouter();
  const { t } = useTranslation(["common", "bounty", "pull-request", "proposal"]);

  const [searchState, setSearchState] = useState("");
  const [bountiesList, setBountiesList] = useState<SearchBountiesPaginated>();

  const debouncedSearchUpdater = useDebouncedCallback((value) => setSearch(value), 500);

  const { state: appState } = useAppState();
  const { nextPage } = usePage();
  const { search, setSearch, clearSearch } = useSearch();

  const { state, time, repoId } = router.query;

  const hasMorePages = bountiesList?.currentPage < bountiesList?.pages;
  const hasIssues = !!bountiesList?.rows?.length;
  const hasFilter = !!(state || time || repoId || search);
  const isManagement = variant === 'management';
  const isProfile = variant === "profile";
  const isBountyHall = variant === "bounty-hall";
  const isOnNetwork = !!router?.query?.network;
  const variantIssueItem = isManagement ? variant : (isProfile || isBountyHall) ? "multi-network" : "network"
  const columns = [
    t("bounty:management.name"),
    t("bounty:management.link"),
    t("bounty:management.hide"),
    t("bounty:management.cancel"),
  ];

  const filtersByIssueState: FiltersByIssueState = [
    {
      label: t("filters.bounties.all"),
      value: "all",
      emptyState: t("filters.bounties.not-found")
    },
    {
      label: t("filters.bounties.open"),
      value: "open",
      emptyState: t("filters.bounties.open-not-found")
    },
    {
      label: t("filters.bounties.draft"),
      value: "draft",
      emptyState: t("filters.bounties.draft-not-found")
    },
    {
      label: t("filters.bounties.closed"),
      value: "closed",
      emptyState: t("filters.bounties.closed-not-found")
    }
  ];

  const listTitleByType = {
    "bounties": t("bounty:label_other"),
    "pull-requests": t("pull-request:label_other"),
    "proposals": t("proposal:label_other")
  };

  const [filterByState,] = useState<Filter>(filtersByIssueState[0]);

  function showClearButton(): boolean {
    return search.trim() !== "";
  }

  function handleSearchChange(e) {
    setSearchState(e.target.value);
    debouncedSearchUpdater(e.target.value);
  }

  function handleClearSearch(): void {
    setSearchState("");
    clearSearch();
  }

  function updateSearch() {
    setSearch(searchState);
  }

  function handleSearch(event) {
    if (event.key !== "Enter") return;

    updateSearch();
  }

  function handleNotFoundClick() {
    if (!redirect) return router.push('/create-bounty');

    router.push(redirect);
  }

  function isRenderFilter() {
    return (hasIssues || (!hasIssues && hasFilter));
  }

  useEffect(() => {
    setBountiesList(previous => {
      if (!previous || bounties.currentPage === 1) return bounties;

      return {
        ...previous,
        ...bounties,
        rows: previous.rows.concat(bounties.rows)
      };
    });
  }, [bounties]);

  if(inView !== null && inView === false) return null;

  return (
    <CustomContainer
      className={isProfile && "px-0 mx-0" || ""}
      childWrapperClassName={isProfile && "justify-content-left" || ""}
      col={isProfile || isManagement ? "col-12" : undefined}
    >
      {(isBountyHall || isProfile) && (
        <div className="d-flex flex-row align-items-center">
          <h3 className="text-capitalize font-weight-medium">{listTitleByType[type]}</h3>
          <div className="ms-2">
            <span className="p family-Regular text-gray-400 bg-gray-850 border-radius-4 p-1 px-2">
              {bountiesList?.count || 0}
            </span>
          </div>
        </div>
      )}
      {isRenderFilter() ? (
        <div
          className={"row align-items-center list-actions sticky-top bg-body"}
        >
          <div className="col">
            <InputGroup className="border-radius-8">
              <InputGroup.Text className="cursor-pointer" onClick={updateSearch}>
                <SearchIcon />
              </InputGroup.Text>

              <FormControl
                value={searchState}
                onChange={handleSearchChange}
                className="p-2"
                placeholder={t("bounty:search")}
                onKeyDown={handleSearch}
              />

              {showClearButton() && (
                <button
                  className="btn bg-gray-900 border-0 py-0 px-3"
                  onClick={handleClearSearch}
                >
                  <CloseIcon width={10} height={10} />
                </button>
              )}
            </InputGroup>
          </div>

          <div className="col-auto d-none d-xl-flex">
            <div className="d-flex align-items-center">
              <span className="caption text-gray-500 text-nowrap mr-1 font-weight-normal">
                {t("sort.label")}
              </span>

              <ListSort
                options={[
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
                ]}
              />
            </div>
          </div>

          <div className="col-auto">
            <If condition={!isProfile && !isManagement}>
              <IssueFilters />
            </If>

            <div className="d-none d-xl-flex">
              <If condition={isProfile}>
                <SelectNetwork isCurrentDefault={isProfile && isOnNetwork} />
              </If>
              
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <If condition={isManagement && !hasIssues}>
        <div className="row row align-center mb-2 px-3">
          {columns?.map((item) => (
            <div
              className={`d-flex col-${
                item === "Name" ? "6" : "2 justify-content-center"
              }`}
              key={item}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>
      </If>

      <If 
        condition={hasIssues}
        otherwise={
          <div className="pt-4">
            <NothingFound description={emptyMessage || filterByState.emptyState}>
              {(appState.currentUser?.walletAddress && !isBountyHall) && (
                <ReadOnlyButtonWrapper>
                  <ContractButton onClick={handleNotFoundClick}>
                    {buttonMessage || String(t("actions.create-one"))}
                  </ContractButton>
                  </ReadOnlyButtonWrapper>
                )}
            </NothingFound>
          </div>
        }
      >
        <InfiniteScroll
          handleNewPage={nextPage}
          isLoading={appState.loading?.isLoading}
          hasMore={hasMorePages}
        >
          {bountiesList?.rows?.map(issue => 
              <IssueListItem
                issue={issueParser(issue)}
                key={`${issue.repository_id}/${issue.githubId}`}
                variant={variantIssueItem}
              />)}
        </InfiniteScroll>
      </If>
      <ScrollTopButton />
    </CustomContainer>
  );
}
