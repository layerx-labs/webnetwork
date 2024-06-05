
import { useEffect, useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { DistributionParticipant } from "components/proposal/new-proposal-modal/controller";


import { lowerCaseCompare } from "helpers/string";
import { validateDistribution, ValidateDistributionError } from "helpers/validate-distribution";

import { User } from "interfaces/api";
import { Deliverable, IssueBigNumberData } from "interfaces/issue-data";

import { ProposalDistributionEditorView } from "./proposal-distribution-editor.view";

interface ProposalDistributionEditorProps {
  distributionParticipants: DistributionParticipant[];
  task: IssueBigNumberData;
  deliverable: Deliverable;
  onCancelDistributionEditClick: () => void;
  setDistributionParticipants: (participants: DistributionParticipant[]) => void;
}

export function ProposalDistributionEditor({
  distributionParticipants,
  task,
  deliverable,
  onCancelDistributionEditClick,
  setDistributionParticipants,
}: ProposalDistributionEditorProps) {
  const [selectedParticipantsMap, setSelectedParticipantsMap] = 
    useState(distributionParticipants?.reduce((acc, curr) => ({ ...acc, [curr?.user?.address]: true }), {}));
  const [editingDistributionError, setEditingDistributionError] = useState<ValidateDistributionError>();
  const [participants, setParticipants] = useState<DistributionParticipant[]>(distributionParticipants);

  const isParticipantAlreadySelected = (user: User) => !!selectedParticipantsMap[user?.address?.toLowerCase()];

  const deliverableCreators: User[] = Object.values(task?.deliverables?.reduce((acc, curr) => {
    const isDeliverableCreator = lowerCaseCompare(deliverable?.user?.address, curr?.user?.address);
    const isReadyForReview = !!curr?.markedReadyForReview;
  
    if (!isDeliverableCreator && isReadyForReview && !isParticipantAlreadySelected(curr?.user))
      acc[curr?.user?.address?.toLowerCase()] = curr?.user;
    return acc;
  }, {}));

  function updateParticipantsMap(address: string, selected: boolean) {
    setSelectedParticipantsMap(previous => ({
      ...previous,
      [address]: selected
    }));
  }

  function addParticipant(user: User) {
    updateParticipantsMap(user?.address, true);
    setParticipants(previous => ([...previous, { user, percentage: 0 }]));
  }

  function removeParticipant(user: User) {
    updateParticipantsMap(user?.address, false);
    
    setParticipants(previous => {
      const tmp = [...previous];
      const userIndex = tmp.findIndex(p => lowerCaseCompare(p?.user?.address, user?.address));
      tmp.splice(userIndex, 1);
      if (tmp.length === 1)
        tmp[0].percentage = 100;
      return tmp;
    });
  }

  function updateParticipant(user: User, percentage: number) {
    setParticipants(previous => {
      const tmp = [...previous];
      const userIndex = tmp.findIndex(p => lowerCaseCompare(p?.user?.address, user?.address));
      tmp.splice(userIndex, 1, { 
          user, 
          percentage,
          isDeliverableCreator: lowerCaseCompare(user?.address, deliverable?.user?.address)
      });
      return tmp;
    });
  }

  function validateParticipants() {
    if (!participants?.length) return;

    if (participants.length > 1)
      setEditingDistributionError(validateDistribution(participants, deliverable?.id, task));
    else
      setEditingDistributionError(null);
  }

  function onSaveClick() {
    if (editingDistributionError) return;
    setDistributionParticipants(participants);
    onCancelDistributionEditClick();
  }

  function onCancelClick() {
    setParticipants(distributionParticipants);
    onCancelDistributionEditClick();
  }

  const debouncedValidateParticipants = useDebouncedCallback(validateParticipants, 200);

  useEffect(() => {
    debouncedValidateParticipants();
  }, [participants]);

  return(
    <ProposalDistributionEditorView
      availableUsers={deliverableCreators}
      participants={participants}
      error={editingDistributionError}
      onCancelClick={onCancelClick}
      onSaveClick={onSaveClick}
      onChangeDistribution={updateParticipant}
      onAddParticipant={addParticipant}
      onRemoveParticipant={removeParticipant}
    />
  );
}