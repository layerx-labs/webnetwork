import { ReactNode } from "react";

import { useTranslation } from "next-i18next";

import SelectNetwork from "components/bounties/select-network";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import GoTopButton from "components/go-top-button/controller";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import ChainFilter from "components/lists/filters/chain/controller";
import MobileFiltersButton from "components/lists/filters/mobile-button/controller";
import ListHeader from "components/lists/list/header/view";
import ListSearchBar from "components/lists/list/search-bar/view";
import ListSort from "components/lists/sort/controller";
import NothingFound from "components/nothing-found";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";
import ResponsiveWrapper, { ResponsiveEle } from "components/responsive-wrapper";

import { SupportedChainData } from "interfaces/supported-chain-data";

import { HeaderColumn, SortOption } from "types/components";
import { Action } from "types/utils";

interface ListViewProps {
  searchString: string;
  searchPlaceholder?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: Action;
  isOnNetwork?: boolean;
  hasFilter?: boolean;
  sortOptions?: SortOption[];
  children?: ReactNode;
  networkFilter?: boolean;
  withSearchAndFilters?: boolean;
  header?: HeaderColumn[];
  infinite?: boolean;
  chainFilters?: boolean;
  hasMorePages?: boolean;
  chains?: SupportedChainData[];
  onNextPage?: () => void;
  onClearSearch: () => void;
  onSearchInputChange: (event) => void;
  onSearchClick: () => void;
  onEnterPressed: (event) => void;
  itemsContainerClassName?: string;
}

export default function ListView(props: ListViewProps) {
  const { t } = useTranslation("common");

  const {
    searchString,
    searchPlaceholder,
    isEmpty,
    emptyMessage,
    emptyAction,
    isOnNetwork,
    hasFilter,
    sortOptions,
    children,
    networkFilter,
    withSearchAndFilters,
    header,
    infinite,
    hasMorePages,
    chainFilters,
    chains,
    itemsContainerClassName,
    onNextPage,
    onSearchClick,
    onClearSearch,
    onEnterPressed,
    onSearchInputChange,
  } = props;

  return (
    <div>
      <If condition={withSearchAndFilters}>
        <div className="row align-items-center justify-content-between list-actions sticky-top bg-dark">
          <div className="col">
            <ListSearchBar
              searchString={searchString}
              placeholder={searchPlaceholder}
              hasFilter={hasFilter}
              onSearchClick={onSearchClick}
              onSearchInputChange={onSearchInputChange}
              onEnterPressed={onEnterPressed}
              onClearSearch={onClearSearch}
            />
          </div>

          <If condition={!!sortOptions}>
            <div className="col-auto d-none d-xl-block">
              <ListSort options={sortOptions} />
            </div>
          </If>

          <If condition={!!chainFilters}>
            <div className="col-auto d-none d-xl-block">
              <ChainFilter chains={chains} />
            </div>
          </If>

          <If condition={networkFilter}>
            <div className="col-auto d-none d-xl-block">
              <SelectNetwork isCurrentDefault={isOnNetwork} fontRegular/>
            </div>
          </If>

          <div className="col-auto d-block d-xl-none">
            <MobileFiltersButton>
              <If condition={!!sortOptions}>
                <ListSort options={sortOptions} asSelect />
              </If>

              <If condition={networkFilter}>
                <SelectNetwork isCurrentDefault={isOnNetwork} onlyProfileFilters fontRegular/>
              </If>

              <If condition={!!chainFilters}>
                <ChainFilter chains={chains} direction="vertical" />
              </If>
            </MobileFiltersButton>
          </div>
        </div>
      </If>

      <If
        condition={!isEmpty}
        otherwise={
          <div className="pt-4">
            <NothingFound description={emptyMessage || t("misc.empty-list")}>
              <If condition={!!emptyAction}>
                <ReadOnlyButtonWrapper>
                  <ContractButton onClick={emptyAction?.onClick}>
                    {emptyAction?.label}
                  </ContractButton>
                </ReadOnlyButtonWrapper>
              </If>
            </NothingFound>
          </div>
        }
      >
        <If condition={!!header}>
          <ResponsiveEle
            desktopView={<ListHeader columns={header} />}
          />
        </If>

        <If condition={infinite} otherwise={<div className="d-flex flex-column gap-3">{children}</div>}>
          <InfiniteScroll
            handleNewPage={onNextPage}
            hasMore={hasMorePages}
            className={itemsContainerClassName || "d-flex flex-column gap-2"}
          >
            {children}
          </InfiniteScroll>
        </If>

        <GoTopButton />
      </If>
    </div>
  );
}
