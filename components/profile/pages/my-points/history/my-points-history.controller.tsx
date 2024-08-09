import { useState } from "react";

import { DEFAULT_ITEMS_PER_PAGE, paginateArray } from "helpers/paginate";

import { userPointsOfUser } from "x-hooks/use-points-of-user";

import { MyPointsHistoryView, PageElement } from "./my-points-history.view";

export function MyPointsHistory() {
  const [page, setPage] = useState(1);

  const { collectedPoints, fetchingCollectedPoints } = userPointsOfUser();

  const { data, pages } = paginateArray(collectedPoints, DEFAULT_ITEMS_PER_PAGE, page);

  function getPagesElement() {
    const separatorElement = { label: "...", isSeparator: true };
    const pagesToRender = 5;
    const pagesElements: PageElement[] = Array(pages)
      .fill(1)
      .map((e, i) => ({
        label: e + i,
        isActive: page === (e + i),
        onClick: () => setPage(e + i)
      }));
    const pagesQuantity = pagesElements.length;

    if (pages <= pagesToRender)
      return pagesElements;

    if (page < 4)
      return [...pagesElements.slice(0, 4), separatorElement, pagesElements[pagesQuantity - 1]];
    else if (page > pagesQuantity - 3)
      return [pagesElements[0], separatorElement, ...pagesElements.slice(pagesQuantity - 4, pagesQuantity)];
    else
      return [
        pagesElements[0], 
        separatorElement,
        pagesElements[page - 2],
        pagesElements[page - 1],
        pagesElements[page],
        separatorElement,
        pagesElements[pagesQuantity - 1],
      ];
  }

  function onPreviousClick() {
    if (page === 1)
      return;

    setPage(previous => previous -1);
  }

  function onNextClick() {
    if (page === pages)
      return;

    setPage(previous => previous + 1);
  }

  return (
    <MyPointsHistoryView 
      loading={fetchingCollectedPoints} 
      history={data}
      page={page}
      pages={getPagesElement()}
      onPreviousClick={onPreviousClick}
      onNextClick={onNextClick}
    />
  );
}