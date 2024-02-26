import List from "components/lists/list/controller";
import NftsListItem from "components/lists/nfts/nfts-list-item/nfts-list-item.controller";

import { Payment } from "interfaces/payments";

interface NftsListViewProps {
  payments: Payment[];
  hasMorePages: boolean;
}
export default function NftsListView ({
  payments,
  hasMorePages
}: NftsListViewProps) {

  return (
    <div className="mb-4">
      <List
        withSearchAndFilters={false}
        hasMorePages={hasMorePages}
        itemsContainerClassName="row gy-4 gx-4"
        infinite
      >
        {payments?.map(payment => <div className="col-12 col-sm-6 col-md-4" key={payment?.transactionHash}>
          <NftsListItem payment={payment} />
        </div>)}
      </List>
    </div>
  );
}