import {useEffect, useState} from "react";

import {useRouter} from "next/router";

import {IssueFilterBoxOption} from "interfaces/filters";

import useMarketplace from "./use-marketplace";

type FiltersTypes = "time" | "state";

type FilterStateUpdater = (
  opts: IssueFilterBoxOption[],
  opt: IssueFilterBoxOption,
  checked: boolean,
  type: FiltersTypes,
  multi?: boolean
) => void;

export default function useFilters(): [
  IssueFilterBoxOption[][],
  FilterStateUpdater,
  () => void,
  (option: IssueFilterBoxOption, type: FiltersTypes) => void,
  () => void,
] {
  const router = useRouter();

  const [timeFilters, setTimeFilters] = useState<IssueFilterBoxOption[]>([]);
  const [stateFilters, setStateFilters] = useState<IssueFilterBoxOption[]>([]);

  const marketplace = useMarketplace();

  function getActiveFiltersOf(opts: IssueFilterBoxOption[]) {
    return opts
      .filter(({ checked, label }) => checked && label !== "All")
      .map(({ value }) => value)
      .join(",");
  }

  function updateRouterQuery() {
    const state = getActiveFiltersOf(stateFilters);
    const time = getActiveFiltersOf(timeFilters);

    const query = {
      ...router.query,
      ...(state !== "" ? { state } : { state: undefined }),
      ...(time !== "" ? { time } : { time: undefined }),
      page: "1"
    };

    router.push({ pathname: router.pathname, query }, router.asPath, { shallow: false, scroll: false });
  }

  function makeFilterOption(label, value, checked = false) {
    return { label, value, checked };
  }

  function loadFilters() {
    const { time, state } = router.query || {};

    setStateFilters([
      makeFilterOption("All", "allstates", !state),
      makeFilterOption("Open Tasks", "open", state === "open"),
      makeFilterOption("Funding Tasks", "funding", state === "funding"),
      makeFilterOption("Draft Tasks", "draft", state === "draft"),
      makeFilterOption("Closed Tasks", "closed", state === "closed")
    ]);

    setTimeFilters([
      makeFilterOption("All", "alltime", !time),
      makeFilterOption("Past Week", "week", time === "week"),
      makeFilterOption("Past Month", "month", time === "month"),
      makeFilterOption("Past Year", "year", time === "year")
    ]);
  }

  useEffect(loadFilters, [router.query]);

  function updateOpt(opts: IssueFilterBoxOption[],
                     opt: IssueFilterBoxOption,
                     checked: boolean,
                     type: "time" | "state",
                     multi = false): void {
    const tmp: IssueFilterBoxOption[] = [...opts];

    if (multi) tmp.find((o) => o.value === opt.value).checked = checked;
    else
      tmp.forEach((o) => (o.checked = o.value === opt.value ? checked : false));

    if (type === "time") setTimeFilters(tmp);
    else if (type === "state") setStateFilters(tmp);

    updateRouterQuery();
  }

  function checkOption(option: IssueFilterBoxOption, type: FiltersTypes) {
    if (!option || !type) return;

    const updateChecked = (newChecked, options) => options.map(o => ({
      ...o,
      checked: o.value === newChecked.value ? true : false
    }));

    const checker = {
      time: () => setTimeFilters(updateChecked(option, timeFilters)),
      state: () => setStateFilters(updateChecked(option, stateFilters)),
    }

    checker[type]();
  }

  function clearFilters() {
    const query = {
      ...(router.query.sortBy ? { sortBy: router.query.sortBy } : { sortBy: undefined }),
      ...(router.query.order ? { order: router.query.order } : { order: undefined }),
      ...(router.query.search ? { search: router.query.search } : { search: undefined }),
      network: marketplace?.active.name,
      page: "1"
    };

    router.push({ pathname: router.pathname, query }, router.asPath, { shallow: false, scroll: false });
  }

  return [[stateFilters, timeFilters], updateOpt, clearFilters, checkOption, updateRouterQuery];
}
