import { useEffect, useState } from "react";

import CuratorsListView from "components/lists/curators/view";

import { CuratorsListPaginated } from "types/api";

import usePage from "x-hooks/use-page";

interface CuratorsListProps {
  curators: CuratorsListPaginated;
}

export default function CuratorsList({ curators }: CuratorsListProps) {
  const [curatorsList, setCuratorsList] = useState<CuratorsListPaginated>();

  const { nextPage } = usePage();

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
    <CuratorsListView
      curators={curatorsList}
      onNextPage={nextPage}
    />
  );
}