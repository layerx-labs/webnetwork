import { ReactNode } from "react";
import { Collapse } from "react-bootstrap";
import { components as RSComponents, SingleValueProps } from "react-select";

import { useTranslation } from "next-i18next";

import ProfileEditIcon from "assets/profile-edit-icon";

import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import { HideShowButton } from "components/common/buttons/hide-show-button/hide-show-button.view";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import { ContextualSpan } from "components/contextual-span";
import IconOption from "components/icon-option";
import If from "components/If";
import Modal from "components/modal";
import OpenGraphPreview from "components/open-graph-preview/controller";
import { DistributionParticipant } from "components/proposal/new-proposal-modal/controller";
import PaymentInfo from "components/proposal/new-proposal-modal/payment-info/view";
import { ProposalDistributionEditor } 
  from "components/proposal/new-proposal-modal/proposal-distribution-editor/proposal-distribution-editor.controller";
import ReactSelect from "components/react-select";

import { Deliverable, IssueBigNumberData } from "interfaces/issue-data";

import { PaymentInfoProps } from "types/components";

interface DeliverableOption {
  value: number;
  label: ReactNode;
  spaceBetween: boolean;
  postIcon: ReactNode;
}
interface NewProposalModalViewProps {
  show: boolean;
  isExecuting: boolean;
  isConnected: boolean;
  isPreviewVisible: boolean;
  isEditingDistribution: boolean;
  isExistingDistribution: boolean;
  selectedDeliverable: DeliverableOption;
  deliverablesOptions: DeliverableOption[];
  deliverableUrl: string;
  paymentInfos: PaymentInfoProps[];
  task: IssueBigNumberData;
  currentDeliverable?:  Deliverable;
  distributionParticipants: DistributionParticipant[];
  onClose: () => void;
  onSubmit: () => void;
  onShowPreview: () => void;
  onHidePreview: () => void;
  onEditDistributionClick: () => void;
  onCancelDistributionEditClick: () => void;
  onDeliverableChange: (value: DeliverableOption) => void;
  setDistributionParticipants: (participants: DistributionParticipant[]) => void;
}

function SingleValue (props: SingleValueProps<any>) {
  const data = props.getValue()[0];
  return (
  <RSComponents.SingleValue {...props}>
    <div className={`text-truncate p-1 d-flex bg-none flex-row align-items-center justify-content-between w-100`}>
      <span className="text-overflow-ellipsis">
        {data.label}
      </span>

      <span>
        {data.postIcon}
      </span>
    </div>
  </RSComponents.SingleValue>
  )
}

export default function NewProposalModalView({
  show,
  isExecuting,
  isConnected,
  isPreviewVisible,
  selectedDeliverable,
  deliverablesOptions,
  deliverableUrl,
  paymentInfos,
  isEditingDistribution,
  isExistingDistribution,
  task,
  currentDeliverable,
  distributionParticipants,
  onClose,
  onSubmit,
  onShowPreview,
  onHidePreview,
  onEditDistributionClick,
  onDeliverableChange,
  onCancelDistributionEditClick,
  setDistributionParticipants,
}: NewProposalModalViewProps) {
  const { t } = useTranslation(["proposal", "common"]);

  return (
    <Modal
      show={show}
      title={t("create-modal.title")}
      titlePosition="center"
      onCloseClick={onClose}
      footer={
        <div className="d-flex px-0 mt-2 justify-content-between">
          <Button
            color="gray-800"
            className={`border-radius-4 border border-gray-700 sm-regular text-capitalize font-weight-medium py-2 px-3`}
            onClick={onClose}
            data-testid="modal-proposal-cancel-btn"
          >
            {t("actions.cancel")}
          </Button>

          <ContractButton
            onClick={onSubmit}
            disabled={!isConnected || isExecuting || isEditingDistribution || isExistingDistribution}
            isLoading={isExecuting}
            withLockIcon={!isConnected}
            data-testid="modal-proposal-create-btn"
            className={`border-radius-4 border border-${!isConnected || isExecuting ? "gray-700" : "primary"} 
                  sm-regular text-capitalize font-weight-medium py-2 px-3`}
          >
            <span>{t("actions.create")}</span>
          </ContractButton>
        </div>
      }
    >
      <p className="xs-medium text-gray-100 text-uppercase mb-2">
        {t("create-modal.select-a-deliverable")}
      </p>

      <ReactSelect
        id="deliverableSelect"
        data-testid="deliverable-select"
        components={{
          Option: IconOption,
          SingleValue
        }}
        placeholder={t("common:forms.select-placeholder")}
        value={selectedDeliverable}
        options={deliverablesOptions}
        onChange={onDeliverableChange}
        isSearchable={false}
      />

      <div className="mt-4 pt-1">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="xs-medium text-gray-100 text-uppercase">
            {t("preview")}
          </span>

          <If condition={!!selectedDeliverable}>
            <HideShowButton
              isVisible={isPreviewVisible}
              hideTip={t("actions.hide-preview")}
              showTip={t("actions.show-preview")}
              onHideClick={onHidePreview}
              onShowClick={onShowPreview}
            />
          </If>
        </div>

        <Collapse in={isPreviewVisible}>
          <div>
            <OpenGraphPreview
              url={deliverableUrl}
              previewPlaceholder={t("create-modal.preview-deliverable")}
              openLinkText={t("create-modal.view-deliverable")}
              showOpenLink
            />
          </div>
        </Collapse>
      </div>

      <div className="mt-4 pt-1">
        <If condition={!isEditingDistribution}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="xs-medium text-gray-100 text-uppercase">
              {t("create-modal.payment")}
            </span>

            <If condition={!!selectedDeliverable && !isEditingDistribution}>
              <Tooltip tip={t("actions.edit-distribution")}>
                <div>
                  <Button
                    onClick={onEditDistributionClick}
                    color="gray-800"
                    textClass="text-gray-50"
                    className="border-radius-4 p-1 border-gray-700 not-svg"
                    data-testid="copy-button"
                  >
                    <ProfileEditIcon />
                  </Button>
                </div>
              </Tooltip>
            </If>
          </div>
        </If>

        <If
          condition={!isEditingDistribution}
          otherwise={
            <ProposalDistributionEditor
              distributionParticipants={distributionParticipants}
              task={task}
              deliverable={currentDeliverable}
              onCancelDistributionEditClick={onCancelDistributionEditClick}
              setDistributionParticipants={setDistributionParticipants}
            />
          }
        >
          <div 
            className="mt-2 mb-2 d-flex flex-column align-items-center border border-radius-4 border-gray-800 comment"
          >
            <If
              condition={!!deliverableUrl && !!paymentInfos}
              otherwise={
                <span className="p-5 sm-regular text-gray-600">
                  {t("create-modal.select-a-deliverable")}
                </span>
              }
            >
              <div className="px-2 line-between-children w-100 bg-gray-850 proposal-distribution-payment">
                {paymentInfos?.map((info, index) => <PaymentInfo key={`payment-info-${index}`} {...info} />)}
              </div>
            </If>
          </div>
        </If>

        <If condition={!!isExistingDistribution && !isEditingDistribution}>
          <ContextualSpan context="warning">
            {t("errors.distribution-already-exists")}
          </ContextualSpan>
        </If>

        <If condition={!!deliverableUrl && !!paymentInfos && !isEditingDistribution && !isExistingDistribution}>
          <ContextualSpan context="info" color="blue-200">
            {t("create-modal.fees-info")}
          </ContextualSpan>
        </If>
      </div>
    </Modal>
  );
}