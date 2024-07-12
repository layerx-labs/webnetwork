import NftsListItemView from "components/lists/nfts/nfts-list-item/nfts-list-item.view";

import {Payment} from "interfaces/payments";

import {useSettings} from "x-hooks/use-settings";

import {baseApiImgUrl} from "../../../../services/api";

interface NftsListItemProps {
  payment: Payment
}

export default function NftsListItem ({
  payment
}: NftsListItemProps) {
  const { settings } = useSettings();

  const imageUrl = payment?.issue?.nftImage ? `${baseApiImgUrl}/${settings?.urls?.ipfs}/${payment?.issue?.nftImage}` : null;
  const transactionUrl = `${payment?.issue?.chain?.blockScanner}/${payment?.transactionHash}`;
  const taskUrl = `/${payment?.issue?.network?.name?.toLowerCase()}/task/${payment?.issue?.id}`;

  return (
    <NftsListItemView
      imageUrl={imageUrl}
      transactionUrl={transactionUrl}
      taskUrl={taskUrl}
    />
  );
}