import { useEffect, useState } from "react";

import NftsListView from "components/lists/nfts/nfts-list.view";

import { PaymentPaginatedData } from "types/api";

interface NftsListProps {
  payments: PaymentPaginatedData;
}
export default function NftsList ({
  payments
}: NftsListProps) {
  const [list, setList] = useState<PaymentPaginatedData>();

  const hasMorePages = !!list && list?.currentPage < list?.pages;

  useEffect(() => {
    if (!payments) return;

    setList(previous => {
      if (!previous || payments.currentPage === 1)
        return payments;

      return {
        ...previous,
        ...payments,
        rows: previous?.rows?.concat(payments?.rows)
      };
    });
  }, [payments]);

  return (
    <NftsListView
      payments={list?.rows}
      hasMorePages={hasMorePages}
    />
  );
}