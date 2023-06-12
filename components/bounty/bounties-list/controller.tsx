import React, {useEffect, useState} from "react";

import {useRouter} from "next/router";
import {UrlObject} from "url";
import { useDebouncedCallback } from "use-debounce";

import BountiesListView from "components/bounty/bounties-list/view";

import {useAppState} from "contexts/app-state";

import { issueParser } from "helpers/issue";

import { SearchBountiesPaginated } from "types/api";
import { SearchBountiesPaginatedBigNumber } from "types/components";

import usePage from "x-hooks/use-page";
import useSearch from "x-hooks/use-search";

interface BountiesListProps {
  bounties?: SearchBountiesPaginated;
  redirect?: string | UrlObject;
  emptyMessage?: string;
  buttonMessage?: string;
  variant?: "bounty-hall" | "profile" | "network" | "management"
  type?: "bounties" | "pull-requests" | "proposals";
}

export default function BountiesList({
  emptyMessage,
  buttonMessage,
  redirect,
  variant = "network",
  bounties,
  type = "bounties"
}: BountiesListProps) {
  const router = useRouter();
  
  const [bountiesList, setBountiesList] = useState<SearchBountiesPaginatedBigNumber>();

  const { nextPage } = usePage();
  const { state: appState } = useAppState();
  const { search, setSearch, clearSearch } = useSearch();

  const debouncedSearchUpdater = useDebouncedCallback((e) => setSearch(e.target.value), 500);

  const { state, time, repoId } = router.query;

  const hasFilter = !!(state || time || repoId || search);
  const isOnNetwork = !!router?.query?.network;

  function handleNotFoundClick() {
    if (!redirect) return router.push('/create-bounty');

    router.push(redirect);
  }

  useEffect(() => {
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

  return (
    <BountiesListView
      emptyMessage={emptyMessage}
      buttonMessage={buttonMessage}
      variant={variant}
      bounties={bountiesList}
      type={type}
      searchString={search}
      isOnNetwork={isOnNetwork}
      isConnected={!!appState.currentUser?.walletAddress}
      hasFilter={hasFilter}
      onClearSearch={clearSearch}
      onNotFoundClick={handleNotFoundClick}
      onNextPage={nextPage}
      onSearchInputChange={debouncedSearchUpdater}
    />
  );
}
