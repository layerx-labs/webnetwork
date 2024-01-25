import React, {useEffect, useState} from "react";

import {useRouter} from "next/router";
import {UrlObject} from "url";
import { useDebouncedCallback } from "use-debounce";

import TasksListView from "components/lists/tasks/view";

import { issueParser } from "helpers/issue";

import { SearchBountiesPaginated } from "types/api";
import { SearchBountiesPaginatedBigNumber } from "types/components";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useChain from "x-hooks/use-chain";
import usePage from "x-hooks/use-page";
import useSearch from "x-hooks/use-search";
import useSupportedChain from "x-hooks/use-supported-chain";

interface TasksListProps {
  bounties?: SearchBountiesPaginated;
  redirect?: string | UrlObject;
  emptyMessage?: string;
  buttonMessage?: string;
  variant?: "bounty-hall" | "profile" | "network" | "management"
  type?: "bounties" | "deliverables" | "proposals";
  filterType?: "category" | "search";
  hideFilter?: boolean;
}

export default function TasksList({
  emptyMessage,
  buttonMessage,
  redirect,
  variant = "network",
  bounties,
  type = "bounties",
  hideFilter,
  filterType = "search"
}: TasksListProps) {
  const router = useRouter();

  const [searchState, setSearchState] = useState(router?.query?.search?.toString());
  const [bountiesList, setBountiesList] = useState<SearchBountiesPaginatedBigNumber>();

  const debouncedSearchUpdater = useDebouncedCallback((value) => setSearch(value), 500);

  const { nextPage } = usePage();
  const { getChainFromUrl } = useChain();
  const { supportedChains } = useSupportedChain();
  const { search, setSearch, clearSearch } = useSearch();

  const { currentUser } = useUserStore();
  const { state, time, networkName, networkChain, categories } = router.query;
  const hasFilter = !!(state || time || search || networkName || networkChain || categories);
  const isOnNetwork = !!router?.query?.network;

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

  async function handleNotFoundClick() {
    if (!redirect)
      router.push('/create-task');
    else
      router.push(redirect);
  }

  useEffect(() => {
    if (!bounties) return;

    setBountiesList(previous => {
      if (!previous || bounties.currentPage === 1) 
        return {
          ...bounties,
          rows: bounties.rows.map(issueParser)
        };

      return {
        ...previous,
        ...bounties,
        rows: previous.rows.concat(bounties.rows.map(issueParser))
      };
    });
  }, [bounties]);

  useEffect(() => {
    if (router?.query?.page)
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: "1",
        },
      });
  }, []);

  return (
    <TasksListView
      emptyMessage={emptyMessage}
      buttonMessage={buttonMessage}
      variant={variant}
      currentChain={getChainFromUrl()}
      bounties={bountiesList}
      type={type}
      searchString={searchState}
      isOnNetwork={isOnNetwork}
      isConnected={!!currentUser?.walletAddress}
      hasFilter={hasFilter}
      onSearchClick={updateSearch}
      onClearSearch={handleClearSearch}
      onNotFoundClick={handleNotFoundClick}
      onNextPage={nextPage}
      onEnterPressed={handleSearch}
      onSearchInputChange={handleSearchChange}
      hideFilter={hideFilter}
      chains={supportedChains}
      filterType={filterType}
    />
  );
}
