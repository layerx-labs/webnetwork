import { useTranslation } from "next-i18next";

import SelectNetwork from "components/bounties/select-network";
import If from "components/If";
import IssueFilters from "components/issue-filters";
import ChainFilter from "components/lists/filters/chain/controller";
import ListSearchBar, { ListSearchBarProps } from "components/lists/list/search-bar/view";
import ListSort from "components/lists/sort/controller";
import ResponsiveWrapper from "components/responsive-wrapper";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { SortOption } from "types/components";

interface TasksListsSearchFiltersProps extends ListSearchBarProps {
  isManagement?: boolean;
  isProfile?: boolean;
  isOnNetwork?: boolean;
  isBountyHall?: boolean;
  hideFilter?: boolean;
  sortOptions: SortOption[];
  chains?: SupportedChainData[];
}

export default function TasksListsSearchFilters ({
  isManagement,
  isProfile,
  isOnNetwork,
  isBountyHall,
  hideFilter,
  sortOptions,
  chains,
 ...rest
}: TasksListsSearchFiltersProps) {
  const { t } = useTranslation(["common", "bounty", "deliverable", "proposal"]);
  
  return(
    <div
      className={"row align-items-center list-actions sticky-top bg-body"}
    >
      <div className="col">
        <ListSearchBar
          searchString={rest?.searchString}
          placeholder={t("bounty:search")}
          hasFilter={rest?.hasFilter}
          onSearchClick={rest?.onSearchClick}
          onSearchInputChange={rest?.onSearchInputChange}
          onEnterPressed={rest?.onEnterPressed}
          onClearSearch={rest?.onClearSearch}
        />
      </div>

      <ResponsiveWrapper xs={isManagement || isBountyHall} xl={true} className="col-auto">
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
                filterByConnectedChain={isOnNetwork}
              />
              <div className="d-flex align-items-center ms-3">
                <label className="sm-regular text-capitalize font-weight-medium text-gray-100 text-nowrap mr-1">
                  {t("misc.chain")}
                </label>
                <ChainFilter chains={chains} label={false} />
              </div>
            </If>
          </div>
        </div>
      </If>
    </div>
  );
}