import { useTranslation } from "next-i18next";

import CuratorListBar from "components/curator-list-bar";
import CuratorListItem from "components/curator-list-item";
import CustomContainer from "components/custom-container";
import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import NothingFound from "components/nothing-found";
import ScrollTopButton from "components/scroll-top-button";

import { CuratorsListPaginated } from "types/api";

interface CuratorsListViewProps {
  curators: CuratorsListPaginated;
  onNextPage: () => void;
}

export default function CuratorsListView({
  curators,
  onNextPage,
}: CuratorsListViewProps) {
  const { t } = useTranslation(["common", "council"]);

  const isListEmpty = !curators?.count;
  const hasMore = !isListEmpty && curators?.currentPage < curators?.pages;

  return (
    <CustomContainer>
      <CuratorListBar />
      
      <If 
        condition={!isListEmpty}
        otherwise={
          <NothingFound description={t("council:errors.not-found")} />
        }
      >
        <InfiniteScroll
          handleNewPage={onNextPage}
          hasMore={hasMore}
        >
          {
            curators?.rows?.map(curator => <CuratorListItem
                                key={`curator-${curator?.address}`}
                                curator={curator}
                              />)
          }
        </InfiniteScroll>
      </If>
      
      <ScrollTopButton />
    </CustomContainer>
  );
}