import { useEffect, useState } from "react";

import CuratorsListView from "components/lists/curators/view";

import { PaginatedCuratorOverview } from "types/api";

interface CuratorsListProps {
  curators: PaginatedCuratorOverview;
}

export default function CuratorsList({ curators }: CuratorsListProps) {
  const [curatorsList, setCuratorsList] = useState<PaginatedCuratorOverview>();

  useEffect(() => {
    if (!curators) return;

    setCuratorsList((previous) => {
      if (!previous || curators.currentPage === 1)
        return {
          ...curators,
          rows: curators.rows,
        };

      return {
        ...previous,
        ...curators,
        rows: previous.rows.concat(curators.rows),
      };
    });
  }, [curators]);

  return <CuratorsListView curators={curatorsList} />;
}
