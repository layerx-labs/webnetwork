import { useContext, useEffect } from "react";

import { BountyEffectsContext } from "contexts/bounty-effects";

import { useTaskStore } from "./stores/task/task.store";
import { useUserStore } from "./stores/user/user.store";
import { useAuthentication } from "./use-authentication";
import { useSettings } from "./use-settings";

export function useTask() {
  if (!useContext(BountyEffectsContext))
    throw new Error(`useTask() depends on <BountyEffectsProvider />`);


  const { data: currentTask, updateTask } = useTaskStore();
  const { settings } = useSettings();
  const { currentUser } = useUserStore();
  const { updateKycSession } = useAuthentication();

  function validateKycSteps(){
    const sessionSteps = currentUser?.kycSession?.steps;
    const bountyTierNeeded = currentTask?.data?.kycTierList;
    const settingsTierAllowed = settings?.kyc?.tierList;

    if(!sessionSteps?.length || !bountyTierNeeded?.length) return;

    const missingSteps = settingsTierAllowed
                          ?.filter(({id}) => bountyTierNeeded.includes(+id))
                          ?.map(tier=>({
                            ...tier,
                            steps: sessionSteps
                                    .filter(({id, state}) => tier.steps_id.includes(id) && state !== "VALIDATED")
                          }))
                          ?.filter(({steps})=> steps?.length) || [];

    updateTask({ kycSteps: missingSteps })
  }

  useEffect(updateKycSession, [currentUser?.accessToken,
                               currentUser?.match,
                               currentUser?.walletAddress,
                               settings?.kyc?.tierList]);

  return {
    validateKycSteps,
  }
}