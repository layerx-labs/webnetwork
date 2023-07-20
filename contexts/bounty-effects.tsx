import {ReactNode, createContext, useEffect} from "react";

import {useRouter} from "next/router";

import { useAppState } from "contexts/app-state";

import { CurrentBounty } from "interfaces/application-state";

import {useBounty} from "x-hooks/use-bounty";
import { useRepos } from "x-hooks/use-repos";

interface BountyEffectsProviderProps {
  children: ReactNode;
  currentBounty: CurrentBounty;
}

const _context = {};

export const BountyEffectsContext = createContext(_context);

export const BountyEffectsProvider = ({ children, currentBounty }: BountyEffectsProviderProps) => {
  const repos = useRepos();
  const bounty = useBounty();
  const { query } = useRouter();
  const { state } = useAppState();

  useEffect(repos.updateActiveRepo, [
    query?.repoId, 
    state.Service?.network?.repos
  ]);

  useEffect(bounty.validateKycSteps, [
      currentBounty?.data?.isKyc,
      currentBounty?.data?.kycTierList,
      state?.currentUser?.kycSession,
  ]);

  return <BountyEffectsContext.Provider value={_context} children={children} />
}