import { useRouter } from "next/router";

import PaymentsNetworkView from "components/pages/profile/payments/network/view";

import { NetworkPaymentsData } from "types/api";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";

interface PaymentsNetworkProps {
  networkPayments: NetworkPaymentsData;
  totalConverted: number;
  defaultFiat: string;
}

export default function PaymentsNetwork({
  networkPayments,
  totalConverted,
  defaultFiat,
}: PaymentsNetworkProps) {
  const { push } = useRouter();

  const { currentUser } = useUserStore();
  const { goToProfilePage, getURLWithNetwork } = useMarketplace();

  function handleBack() {
    goToProfilePage("payments", {
      networkName: "",
      networkChain: "",
      wallet: currentUser?.walletAddress
    });
  }

  function redirectToNetwork(id = undefined) {
    const isBountyRedirect = !!id;

    const path = isBountyRedirect ? "/task/[id]" : "/tasks";

    push(getURLWithNetwork(path, {
      network: networkPayments?.name,
      ... isBountyRedirect ? { id } : {}
    }));
  }

  function goToNetwork() {
    redirectToNetwork();
  }

  function goToBounty(payment) {
    return () => {
      if (!payment?.issue?.id) return;

      redirectToNetwork(payment?.issue?.id);
    };
  }

  return(
    <PaymentsNetworkView
      networkPayments={networkPayments}
      totalConverted={totalConverted}
      defaultFiat={defaultFiat}
      handleBack={handleBack}
      goToNetwork={goToNetwork}
      goToBounty={goToBounty}
    />
  );
}