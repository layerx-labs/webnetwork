import { useContext } from "react";

import { useAppState } from "contexts/app-state";
import { BountyEffectsContext } from "contexts/bounty-effects";
import { changeCurrentKycSteps } from "contexts/reducers/change-current-bounty";

import { useUserStore } from "./stores/user/user.store";
import { useSettings } from "./use-settings";

export function useBounty() {
  if (!useContext(BountyEffectsContext))
    throw new Error(`useBounty() depends on <BountyEffectsProvider />`);


  const { state, dispatch } = useAppState();
  const { settings } = useSettings();
  const { currentUser } = useUserStore();

  function validateKycSteps(){
    const sessionSteps = currentUser?.kycSession?.steps;
    const bountyTierNeeded = state?.currentBounty?.data?.kycTierList;
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

    dispatch(changeCurrentKycSteps(missingSteps))
  }

  return {
    validateKycSteps,
  }
}