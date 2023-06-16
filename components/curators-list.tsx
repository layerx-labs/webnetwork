import { useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import CuratorListBar from "components/curator-list-bar";
import CuratorListItem from "components/curator-list-item";
import CustomContainer from "components/custom-container";
import InfiniteScroll from "components/infinite-scroll";
import NothingFound from "components/nothing-found";
import ScrollTopButton from "components/scroll-top-button";

import { CuratorsListPaginated } from "types/api";

import usePage from "x-hooks/use-page";

interface CuratorsListProps {
  curators: CuratorsListPaginated;
}

export default function CuratorsList({ curators }: CuratorsListProps) {
  const { t } = useTranslation(["common", "council"]);

  const [curatorsList, setCuratorsList] = useState<CuratorsListPaginated>();

  const { nextPage } = usePage();

  const isListEmpty = !curatorsList?.count;
  const hasMore = !isListEmpty && curatorsList?.currentPage < curatorsList?.pages;

  useEffect(() => {
    if (!curators) return;
    
    setCuratorsList(previous => {
      if (!previous || curators.currentPage === 1) 
        return {
          ...curators,
          rows: curators.rows
        };

      return {
        ...previous,
        ...curators,
        rows: previous.rows.concat(curators.rows)
      };
    });
  }, [curators]);

  return (
    <CustomContainer>
      <CuratorListBar />
      {(isListEmpty && (
        <NothingFound description={t("council:errors.not-found")} />
      )) || <></>}
      
      {((isListEmpty === false) && (
        <InfiniteScroll
          handleNewPage={nextPage}
          hasMore={hasMore}
        >
          {
            curatorsList?.rows?.map(curator => <CuratorListItem
                                key={`curator-${curator?.address}`}
                                curator={curator}
                              />)
          }
        </InfiniteScroll>
      )) || <></>}

      <ScrollTopButton />
    </CustomContainer>
  );
}