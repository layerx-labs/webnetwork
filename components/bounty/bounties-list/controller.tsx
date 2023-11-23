import React, {useEffect, useState} from "react";

import {useRouter} from "next/router";
import {UrlObject} from "url";
import { useDebouncedCallback } from "use-debounce";

import BountiesListView from "components/bounty/bounties-list/view";

import { issueParser } from "helpers/issue";

import { SearchBountiesPaginated } from "types/api";
import { SearchBountiesPaginatedBigNumber } from "types/components";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useChain from "x-hooks/use-chain";
import usePage from "x-hooks/use-page";
import useSearch from "x-hooks/use-search";
import useSupportedChain from "x-hooks/use-supported-chain";

interface BountiesListProps {
  bounties?: SearchBountiesPaginated;
  redirect?: string | UrlObject;
  emptyMessage?: string;
  buttonMessage?: string;
  variant?: "bounty-hall" | "profile" | "network" | "management"
  type?: "bounties" | "deliverables" | "proposals";
  hideFilter?: boolean;
}

export default function BountiesList({
  emptyMessage,
  buttonMessage,
  redirect,
  variant = "network",
  bounties,
  type = "bounties",
  hideFilter,
}: BountiesListProps) {
  const router = useRouter();
  
  const [searchState, setSearchState] = useState("");
  const [bountiesList, setBountiesList] = useState<SearchBountiesPaginatedBigNumber>();

  const debouncedSearchUpdater = useDebouncedCallback((value) => setSearch(value), 500);

  const { nextPage } = usePage();
  const { currentUser } = useUserStore();
  const { search, setSearch, clearSearch } = useSearch();
  const { getChainFromUrl } = useChain();
  const { supportedChains } = useSupportedChain();
  
  const { state, time, networkName, networkChain } = router.query;

  const hasFilter = !!(state || time || search || networkName || networkChain);
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

  function handleNotFoundClick() {
    if (!redirect) return router.push('/create-task');

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
    <BountiesListView
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
    />
  );
}
