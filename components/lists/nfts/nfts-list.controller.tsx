import { useEffect, useState } from "react";

import NftsListView from "components/lists/nfts/nfts-list.view";

import { SearchBountiesPaginated } from "types/api";

interface NftsListProps {
  nfts: SearchBountiesPaginated;
}
export default function NftsList ({
  nfts
}: NftsListProps) {
  const [list, setList] = useState<SearchBountiesPaginated>();

  const hasMorePages = !!list && list?.currentPage < list?.pages;

  useEffect(() => {
    if (!nfts) return;

    setList(previous => {
      if (!previous || nfts.currentPage === 1)
        return nfts;

      return {
        ...previous,
        ...nfts,
        rows: previous?.rows?.concat(nfts?.rows)
      };
    });
  }, [nfts]);

  return (
    <NftsListView
      nfts={list?.rows}
      hasMorePages={hasMorePages}
    />
  );
}