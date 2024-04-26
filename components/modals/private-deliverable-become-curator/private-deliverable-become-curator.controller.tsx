import PrivateDeliverableBecomeCuratorModalView 
  from "components/modals/private-deliverable-become-curator/private-deliverable-become-curator.view";

import { Network } from "interfaces/network";

import useMarketplace from "x-hooks/use-marketplace";

interface PrivateDeliverableBecomeCuratorModalProps {
  show: boolean;
  marketplace: Network;
  onClose: () => void;
  onActionButtonClick: () => void;
}

export default function PrivateDeliverableBecomeCuratorModal({
  show,
  marketplace,
  onClose,
  onActionButtonClick
}: PrivateDeliverableBecomeCuratorModalProps) {
  const { goToProfilePage } = useMarketplace();

  function onOkClick() {
    onActionButtonClick();
    goToProfilePage("voting-power", { 
      networkName: marketplace?.name, 
      networkChain: marketplace?.chain?.chainShortName
    });
  }

  return(
    <PrivateDeliverableBecomeCuratorModalView
      show={show}
      marketplace={marketplace?.name}
      onClose={onClose}
      onOkClick={onOkClick}
    />
  );
}