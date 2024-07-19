import NftsListItemView from "components/lists/nfts/nfts-list-item/nfts-list-item.view";

import { IssueData } from "interfaces/issue-data";

import {useSettings} from "x-hooks/use-settings";

import {baseApiImgUrl} from "../../../../services/api";

interface NftsListItemProps {
  nft: IssueData
}

export default function NftsListItem ({
  nft
}: NftsListItemProps) {
  const { settings } = useSettings();

  const transactionHash = nft?.payments?.at(0)?.transactionHash;
  const imageUrl = 
    nft?.nftImage ? `${baseApiImgUrl}/${settings?.urls?.ipfs}/${nft?.nftImage}` : null;
  const transactionUrl = `${nft?.network?.chain?.blockScanner}/${transactionHash}`;
  const taskUrl = `/${nft?.network?.name?.toLowerCase()}/task/${nft?.id}`;

  return (
    <NftsListItemView
      imageUrl={imageUrl}
      transactionUrl={transactionUrl}
      taskUrl={taskUrl}
    />
  );
}