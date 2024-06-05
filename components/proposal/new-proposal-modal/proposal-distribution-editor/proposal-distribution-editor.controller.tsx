
import { useEffect, useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import CloseIcon from "assets/icons/close-icon";
import DoneIcon from "assets/icons/done-icon";

import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import { DistributionParticipant } from "components/proposal/new-proposal-modal/controller";

import { lowerCaseCompare } from "helpers/string";
import { validateDistribution, ValidateDistributionError } from "helpers/validate-distribution";

import { User } from "interfaces/api";
import { Deliverable, IssueBigNumberData } from "interfaces/issue-data";

import { AddDistributionParticipantButton } 
  from "../add-distribution-participant-button/add-distribution-participant-button.controller";
import ProposalDistributionEditorParticipant
  from "../proposal-distribution-editor-participant/proposal-distribution-editor-participant.controller";


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
  const isUniqueParticipant = participants?.length === 1;

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
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center gap-2 mr-1 mb-2">
        <span className="xs-medium text-gray-100 text-uppercase">
          Distribution
        </span>

        <div className="d-flex align-items-center gap-2">
          <Tooltip tip={"Cancel"}>
            <div>
              <Button
                onClick={onCancelClick}
                color="gray-800"
                textClass="text-gray-50"
                className="border-radius-4 p-1 border-gray-700 not-svg"
                data-testid="copy-button"
              >
                <CloseIcon width={16} height={16} />
              </Button>
            </div>
          </Tooltip>

          <Tooltip tip={"Save"}>
            <div>
              <Button
                onClick={onSaveClick}
                color="gray-800"
                textClass="text-gray-50"
                className="border-radius-4 p-1 border-gray-700 not-svg"
                data-testid="copy-button"
                disabled={!!editingDistributionError}
              >
                <DoneIcon width={16} height={16} />
              </Button>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className={`d-flex flex-column w-100 px-2 pb-2 line-between-children align-items-center gap-2 
        border border-radius-4 border-gray-800 comment`}>
        <div className="d-flex flex-column align-items-center proposal-distribution-participants">
          {
          participants?.map((participant, index) => (
            <ProposalDistributionEditorParticipant
              key={`editor-distribution-participant-${participant?.user?.address}`}
              user={participant?.user}
              defaultValue={participant?.percentage}
              label={participant?.isDeliverableCreator ? "Deliverable Creator" : `Participant ${index}`}
              isDisable={isUniqueParticipant}
              error={false}
              success={false}
              warning={false}
              isRemovable={!participant?.isDeliverableCreator}
              onChangeDistribution={updateParticipant}
              onRemoveParticipant={removeParticipant}
            />
          ))
          }
        </div>

        <AddDistributionParticipantButton
          users={deliverableCreators}
          onAddParticipant={addParticipant}
        />
      </div>

      <If condition={!!editingDistributionError}>
        <ContextualSpan context="warning" className="mt-2" >
          {editingDistributionError}
        </ContextualSpan>
      </If>
    </div>
  );
}