import {useRouter} from "next/router";

import {Deliverable, IssueBigNumberData} from "interfaces/issue-data";

import useMarketplace from "x-hooks/use-marketplace";

import DeliverableHeroView from "./view";

interface DeliverableHeroControllerProps {
  currentDeliverable: Deliverable;
  currentBounty: IssueBigNumberData;
}

export default function DeliverableHero({currentDeliverable, currentBounty}: DeliverableHeroControllerProps) {
  const router = useRouter();
  
  const { getURLWithNetwork } = useMarketplace();

  function handleBack () {
    if (router?.query?.fromProposal) {
      router.back();
      return;
    }
    router.push(getURLWithNetwork("/task/[id]", { id: currentBounty?.id }));
  }

  return (
    <DeliverableHeroView 
      currentDeliverable={currentDeliverable} 
      currentBounty={currentBounty} 
      handleBack={handleBack}    
    />
  );
}
