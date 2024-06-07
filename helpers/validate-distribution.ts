import { DistributionParticipant } from "components/proposal/new-proposal-modal/controller";

import { lowerCaseCompare } from "helpers/string";

import { IssueBigNumberData, IssueData } from "interfaces/issue-data";

export type ValidateDistributionError = "empty-participant" | "wrong-distribution" | "existing-distribution" | null;

export function validateDistribution( participants: DistributionParticipant[],
                                      deliverableId: number,
                                      task: IssueData | IssueBigNumberData): ValidateDistributionError {
  const { hasEmptyParticipants, totalPercentage } = participants.reduce((acc, curr) => ({ 
    hasEmptyParticipants: acc.hasEmptyParticipants || curr.percentage === 0, 
    totalPercentage: acc.totalPercentage + curr.percentage,
  }), { hasEmptyParticipants: false, totalPercentage: 0 });

  if (hasEmptyParticipants || totalPercentage !== 100) {
    return hasEmptyParticipants ? "empty-participant" : "wrong-distribution";
  }

  const proposalsForDeliverable = 
    task?.mergeProposals?.filter(proposal =>  proposal?.deliverableId === deliverableId && 
                                              !proposal?.isDisputed &&
                                              !proposal?.refusedByBountyOwner);

  if (proposalsForDeliverable.length) {
    const isExistingDistribution = proposalsForDeliverable.some(proposal => {
      const hasEqualParticipantsQuantity = proposal?.distributions?.length === participants?.length;

      if (!hasEqualParticipantsQuantity) 
        return false;

      const isSameDistribution = participants
        .every(participant => !!proposal.distributions.find(distribution => 
          lowerCaseCompare(distribution.recipient, participant.user.address) && 
          distribution.percentage === participant.percentage));
      
      return isSameDistribution;
    });

    if(isExistingDistribution) {
      return "existing-distribution";
    }
  }

  return null;
}