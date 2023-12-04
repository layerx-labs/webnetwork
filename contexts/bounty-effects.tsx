import { ReactNode, createContext, useEffect } from "react";


import { issueParser } from "helpers/issue";

import { IssueData } from "interfaces/issue-data";

import { useTaskStore } from "x-hooks/stores/task/task.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useTask } from "x-hooks/use-task";
interface BountyEffectsProviderProps {
  children: ReactNode;
  currentBounty: IssueData;
}

const _context = {};

export const BountyEffectsContext = createContext(_context);

export const BountyEffectsProvider = ({ children, currentBounty }: BountyEffectsProviderProps) => {  
  const bounty = useTask();
  const { currentUser } = useUserStore();
  const { updateTask } = useTaskStore();

  useEffect(() => {
    const parsedData = issueParser(currentBounty);

    updateTask({ data: parsedData })
  }, [
    currentBounty
  ]);

  useEffect(bounty.validateKycSteps, [
      currentBounty?.isKyc,
      currentBounty?.kycTierList,
      currentUser?.kycSession,
  ]);

  return <BountyEffectsContext.Provider value={_context} children={children} />
}