import { useTranslation } from "next-i18next";

import CloseIcon from "assets/icons/close-icon";
import DoneIcon from "assets/icons/done-icon";

import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import { DistributionParticipant } from "components/proposal/new-proposal-modal/controller";

import { ValidateDistributionError } from "helpers/validate-distribution";

import { User } from "interfaces/api";

import { AddDistributionParticipantButton } 
  from "../add-distribution-participant-button/add-distribution-participant-button.controller";
import ProposalDistributionEditorParticipant
  from "../proposal-distribution-editor-participant/proposal-distribution-editor-participant.controller";

interface ProposalDistributionEditorViewProps {
  availableUsers: User[];
  participants: DistributionParticipant[];
  error: ValidateDistributionError | null;
  onCancelClick: () => void;
  onSaveClick: () => void;
  onChangeDistribution: (user: User, percentage: number) => void;
  onAddParticipant: (user: User) => void;
  onRemoveParticipant: (user: User) => void;
}

export function ProposalDistributionEditorView({
  availableUsers,
  participants,
  error,
  onCancelClick,
  onSaveClick,
  onChangeDistribution,
  onAddParticipant,
  onRemoveParticipant,
}: ProposalDistributionEditorViewProps) {
  const { t } = useTranslation("proposal");

  const isUniqueParticipant = participants?.length === 1;

  return(
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center gap-2 mr-1 mb-2">
        <span className="xs-medium text-gray-100 text-uppercase">
          {t("create-modal.distribution")}
        </span>

        <div className="d-flex align-items-center gap-2">
          <Tooltip tip={t("actions.cancel")}>
            <div>
              <Button
                onClick={onCancelClick}
                color="gray-800"
                textClass="text-gray-50"
                className="border-radius-4 p-1 border-gray-700 not-svg"
                data-testid="cancel-proposal-editing-button"
              >
                <CloseIcon width={16} height={16} />
              </Button>
            </div>
          </Tooltip>

          <Tooltip tip={t("actions.save")}>
            <div>
              <Button
                onClick={onSaveClick}
                color="gray-800"
                textClass="text-gray-50"
                className="border-radius-4 p-1 border-gray-700 not-svg"
                data-testid="submit-proposal-editing-button"
                disabled={!!error}
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
              label={participant?.isDeliverableCreator ? t("create-modal.deliverable-creator") : 
                t("create-modal.participant", { count: index})}
              isDisable={isUniqueParticipant}
              isRemovable={!participant?.isDeliverableCreator}
              onChangeDistribution={onChangeDistribution}
              onRemoveParticipant={onRemoveParticipant}
            />
          ))
          }
        </div>

        <AddDistributionParticipantButton
          users={availableUsers}
          onAddParticipant={onAddParticipant}
        />
      </div>

      <If condition={!!error}>
        <ContextualSpan context="warning" className="mt-2" >
          {t(`errors.${error}`)}
        </ContextualSpan>
      </If>
    </div>
  );
}