import {useTranslation} from "next-i18next";

import List from "components/lists/list/controller";
import NftsListItem from "components/lists/nfts/nfts-list-item/nfts-list-item.controller";

import {Payment} from "interfaces/payments";

import If from "../../If";
import NothingFound from "../../nothing-found";

interface NftsListViewProps {
  payments: Payment[];
  hasMorePages: boolean;
}
export default function NftsListView ({
  payments,
  hasMorePages
}: NftsListViewProps) {
  const { t } = useTranslation("profile");

  return (
    <div className="mb-4">
      <If condition={!payments?.length}>
        <div className="mt-5"> </div>
        <NothingFound description={t("not-found.bepro-pops")} />
      </If>
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