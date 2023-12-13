import {useState} from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import DelegationsView from "components/profile/pages/voting-power/delegations/view";
import TakeBackModal from "components/profile/pages/voting-power/take-back-modal/take-back-modal.view";

import {Curator, Delegation} from "interfaces/curators";
import {NetworkEvents} from "interfaces/enums/events";

import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";


interface DelegationsProps {
  delegations?: Curator[];
  disabled?: boolean;
  updateWalletBalance?: () => void;
}

export default function Delegations({
  disabled,
  delegations,
  updateWalletBalance,
}: DelegationsProps) {
  const { t } = useTranslation("profile");
  const [delegationToTakeBack, setDelegationToTakeBack] = useState<Delegation>(null);

  const { handleTakeBack } = useBepro();
  const [isExecuting, execute] = useContractTransaction(NetworkEvents.OraclesTransfer,
                                                        handleTakeBack,
                                                        t("take-back-success"),
                                                        t("take-back-fail"));

  function onCloseClick() {
    setDelegationToTakeBack(null);
  }

  async function onTakeBackClick () {
    if (!delegationToTakeBack)
      return;
    execute(delegationToTakeBack.contractId, BigNumber(delegationToTakeBack.amount)?.toFixed(), "Oracles")
      .then(() => {
        updateWalletBalance();
        onCloseClick();
      })
      .catch((error) => {
        console.debug("Failed to take back votes", error);
      });
  }

  return (
    <>
      <DelegationsView
        disabled={disabled}
        delegations={delegations}
        onTakeBackClick={setDelegationToTakeBack}
      />

      <TakeBackModal
        delegation={delegationToTakeBack}
        show={!!delegationToTakeBack && !disabled}
        isTakingBack={isExecuting}
        onCloseClick={onCloseClick}
        onTakeBackClick={onTakeBackClick}
      />
    </>
  );
}
