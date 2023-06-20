import { useTranslation } from "next-i18next";

import If from "components/If";
import InfiniteScroll from "components/infinite-scroll";
import CuratorListHeader from "components/lists/curators/header/view";
import CuratorListItem from "components/lists/curators/item/controller";
import NothingFound from "components/nothing-found";
import ResponsiveWrapper from "components/responsive-wrapper";
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
    <>
      <ResponsiveWrapper xs={false} xl={true} className="row">
        <CuratorListHeader />
      </ResponsiveWrapper>
      
      <If 
        condition={!isListEmpty}
        otherwise={
          <NothingFound description={t("council:errors.not-found")} />
        }
      >
        <InfiniteScroll
          handleNewPage={onNextPage}
          hasMore={hasMore}
          className="d-flex flex-column gap-3"
        >
          {
            curators?.rows?.map(curator => 
              <CuratorListItem
                key={`curator-${curator?.address}`}
                curator={curator}
              />)
          }
        </InfiniteScroll>
      </If>
      
      <ScrollTopButton />
    </>
  );
}