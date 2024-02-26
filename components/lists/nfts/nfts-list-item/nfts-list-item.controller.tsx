import NftsListItemView from "components/lists/nfts/nfts-list-item/nfts-list-item.view";

import { Payment } from "interfaces/payments";

import { useSettings } from "x-hooks/use-settings";

interface NftsListItemProps {
  payment: Payment
}

export default function NftsListItem ({
  payment
}: NftsListItemProps) {
  const { settings } = useSettings();

  const imageUrl = payment?.issue?.nftImage ? `${settings?.urls?.ipfs}/${payment?.issue?.nftImage}` : null;
  const transactionUrl = `${payment?.issue?.chain?.blockScanner}/${payment?.transactionHash}`;

  return (
    <NftsListItemView
      imageUrl={imageUrl}
      transactionUrl={transactionUrl}
    />
  );
}