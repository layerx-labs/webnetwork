import {useTranslation} from "next-i18next";

import If from "components/If";
import List from "components/lists/list/controller";
import NftsListItem from "components/lists/nfts/nfts-list-item/nfts-list-item.controller";
import NothingFound from "components/nothing-found";

import { IssueData } from "interfaces/issue-data";

interface NftsListViewProps {
  nfts: IssueData[];
  hasMorePages: boolean;
}
export default function NftsListView ({
  nfts,
  hasMorePages
}: NftsListViewProps) {
  const { t } = useTranslation("profile");

  return (
    <div className="mb-4">
      <If condition={!nfts?.length}>
        <div className="mt-5"> </div>
        <NothingFound description={t("not-found.bepro-pops")} />
      </If>
      <List
        withSearchAndFilters={false}
        hasMorePages={hasMorePages}
        itemsContainerClassName="row gy-4 gx-4"
        infinite
      >
        {nfts?.map(nft => <div className="col-12 col-sm-6 col-md-4" key={nft?.id}>
          <NftsListItem nft={nft} />
        </div>)}
      </List>
    </div>
  );
}