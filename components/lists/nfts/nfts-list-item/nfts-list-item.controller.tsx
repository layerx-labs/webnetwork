import OpenGraphPreview from "components/open-graph-preview/controller";

import { Payment } from "interfaces/payments";

import { useSettings } from "x-hooks/use-settings";

interface NftsListItemProps {
  payment: Payment
}

export default function NftsListItem ({
  payment
}: NftsListItemProps) {
  const { settings } = useSettings();

  const imageUrl = `${settings?.urls?.ipfs}/${payment?.issue?.nftImage}`;
  const previewUrl = `${payment?.issue?.chain?.blockScanner}/${payment?.transactionHash}`;

  return (
    <OpenGraphPreview
      url={imageUrl}
      link={previewUrl}
      openLinkText={"View on chain explorer"}
      showOpenLink
    />
  );
}