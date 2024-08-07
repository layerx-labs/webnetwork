import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import MakeDeliverableRedyModalView from "components/modals/make-deliverable-ready/view";

import { NetworkEvents } from "interfaces/enums/events";

import { getDeliverable } from "x-hooks/api/deliverable/get-deliverable";
import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";
import { useTaskSubscription } from "x-hooks/use-task-subscription";

interface MakeDeliverableRedyModalProps {
  bountyContractId: number;
  deliverableId: number;
}

export default function MakeDeliverableRedyModal({
  bountyContractId,
  deliverableId,
}: MakeDeliverableRedyModalProps) {
  const { query, push } = useRouter();
  const { t } = useTranslation("deliverable");

  const { getURLWithNetwork } = useMarketplace();
  const { handleMakePullRequestReady } = useBepro();
  const { refresh: refreshSubscriptions } = useTaskSubscription();
  const [isMakingReady, onMakeReady] = useContractTransaction(NetworkEvents.PullRequestReady, 
                                                              handleMakePullRequestReady,
                                                              t("modals.make-ready.success"),
                                                              t("modals.make-ready.error"));

  const { data: deliverable } = useReactQuery(["deliverable", deliverableId], () => getDeliverable(deliverableId), {
    enabled: !!deliverableId
  });
  const hasContractId = deliverable?.prContractId !== null;

  function goToDeliverable() {
    refreshSubscriptions();
    push(getURLWithNetwork("/task/[id]/deliverable/[deliverableId]", {
      ...query,
      deliverableId
    }));
  }
  
  function handleMakeReady() {
    refreshSubscriptions();
    onMakeReady(bountyContractId, deliverable?.prContractId)
      .then(() => goToDeliverable())
      .catch(error => console.debug("Failed to make ready", error.toString()));
  }

  return(
    <MakeDeliverableRedyModalView
      isVisible={!!deliverableId}
      isExecuting={isMakingReady}
      isActionDisabled={!hasContractId}
      onClose={goToDeliverable}
      onMakeReady={handleMakeReady}
    />
  );
}