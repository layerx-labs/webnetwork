import { FormControl, InputGroup } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import CloseIcon from "assets/icons/close-icon";
import SearchIcon from "assets/icons/search-icon";

import Button from "components/button";
import CustomContainer from "components/custom-container";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import LeaderBoardListItem from "components/leaderboard-list/item/view";
import LeaderBoardListBar from "components/leaderboard-list/leaderboard-list-bar";
import ListSort from "components/list-sort";
import NothingFound from "components/nothing-found";
import ResponsiveWrapper from "components/responsive-wrapper";
import ScrollTopButton from "components/scroll-top-button";

import { LeaderBoardPaginated } from "types/api";

interface LeaderBoardListViewProps {
  leaderboard: LeaderBoardPaginated;
  searchString: string;
  onClearSearch: () => void;
  onNextPage: () => void;
  onSearchInputChange: (event) => void;
  onSearchClick: () => void;
  onEnterPressed: (event) => void;
}

export default function LeaderBoardListView({
  leaderboard,
  searchString,
  onClearSearch,
  onNextPage,
  onSearchInputChange,
  onSearchClick,
  onEnterPressed,
}: LeaderBoardListViewProps) {
  const { t } = useTranslation(["common", "leaderboard"]);

  const hasData = !!leaderboard?.count;
  const hasMore = hasData && leaderboard?.currentPage < leaderboard?.pages;
  const hasFilter = searchString?.trim() !== "";
  const showSearchFilter = hasData || !hasData && hasFilter;
  const sortOptions = [
    {
      value: "most-nfts",
      sortBy: "numberNfts",
      order: "DESC",
      label: t("leaderboard:sort.most-nfts")
    },
    {
      value: "lowest-nfts",
      sortBy: "numberNfts",
      order: "ASC",
      label: t("leaderboard:sort.lowest-nfts")
    }
  ];

  return (
    <CustomContainer>
      <If condition={showSearchFilter}>
        <div
          className={"row w-100 align-items-center list-actions sticky-top bg-dark"}
        >
          <div className="col">
            <InputGroup className="border-radius-8">
              <InputGroup.Text className="cursor-pointer" onClick={onSearchClick}>
                <SearchIcon />
              </InputGroup.Text>

              <FormControl
                value={searchString}
                onChange={onSearchInputChange}
                className="p-2"
                placeholder={t("leaderboard:search")}
                onKeyDown={onEnterPressed}
              />

              <If condition={hasFilter}>
                <Button
                  className="bg-gray-900 border-0 py-0 px-3 rounded-0"
                  onClick={onClearSearch}
                >
                  <CloseIcon width={10} height={10} />
                </Button>
              </If>
            </InputGroup>
          </div>

          <div className="col-auto d-flex align-items-center px-0">
            <span className="caption-small text-white-50 text-nowrap mr-1">
              {t("sort.label")}
            </span>

            <ListSort options={sortOptions} />
          </div>
        </div>
      </If>
      
      <ResponsiveWrapper
        xs={false}
        xl={true}
        className="row"
      >
        <LeaderBoardListBar />
      </ResponsiveWrapper>

      <If
        condition={hasData}
        otherwise={
          <div className="pt-4">
            <NothingFound description={t("leaderboard:not-found")} />
          </div>
        }
      >
        <div className="px-3">
          <InfiniteScroll
            handleNewPage={onNextPage}
            hasMore={hasMore}
            className="d-flex flex-column gap-3"
          >
            {leaderboard?.rows?.map((item) => <LeaderBoardListItem key={item?.address} {...item} />)}
          </InfiniteScroll>
        </div>
      </If>
      <ScrollTopButton />
    </CustomContainer>
  );
}