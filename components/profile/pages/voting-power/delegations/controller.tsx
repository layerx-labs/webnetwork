import {useState} from "react";

import DelegationsView from "components/profile/pages/voting-power/delegations/view";

import {Curator, Delegation} from "interfaces/curators";

import useBepro from "x-hooks/use-bepro";

import { useUserStore } from "x-hooks/stores/user/user.store";
import TakeBackModal from "../take-back-modal/take-back-modal.view";

interface DelegationsProps {
  delegations?: Curator[];
}

export default function Delegations({
  delegations,
}: DelegationsProps) {
  const [delegationToTakeBack, setDelegationToTakeBack] = useState<Delegation>(null);

  const { handleTakeBack } = useBepro();

  function handleCancel() {
    setDelegationToTakeBack(null);
  }

  return (
    <>
      <DelegationsView
        delegations={delegations}
        onTakeBackClick={setDelegationToTakeBack}
      />

      <TakeBackModal
        delegation={delegationToTakeBack}
        show={!!delegationToTakeBack}
        isTakingBack={true}
        onCloseClick={handleCancel}
        onTakeBackClick={async () => {}}
      />
    </>
  );
}
