import { components as RSComponents, SingleValueProps } from "react-select";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import { ContextualSpan } from "components/contextual-span";
import ContractButton from "components/contract-button";
import IconOption from "components/icon-option";
import If from "components/If";
import Modal from "components/modal";
import OpenGraphPreview from "components/open-graph-preview/controller";
import PaymentInfo from "components/proposal/new-proposal-modal/payment-info/view";
import ReactSelect from "components/react-select";

interface NewProposalModalViewProps {
  show: boolean;
  isExecuting: boolean;
  isConnected: boolean;
  selectedDeliverable: any;
  deliverablesOptions: any;
  deliverableUrl: string;
  paymentInfos: any;
  onClose: () => void;
  onSubmit: () => void;
  onDeliverableChange: (value: any) => void;
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
  selectedDeliverable,
  deliverablesOptions,
  deliverableUrl,
  paymentInfos,
  onClose,
  onSubmit,
  onDeliverableChange,
}: NewProposalModalViewProps) {
  const { t } = useTranslation(["proposal", "common"]);

  return (
    <Modal
      show={show}
      title={t("create-modal.title")}
      titlePosition="center"
      onCloseClick={onClose}
      footer={
        <div className="d-flex justify-content-between">
          <Button color="dark-gray" onClick={onClose}>
            {t("actions.cancel")}
          </Button>

          <ContractButton
            onClick={onSubmit}
            disabled={!isConnected || isExecuting}
            isLoading={isExecuting}
            withLockIcon={!isConnected}
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

      <div className="mt-4 pt-2">
        <OpenGraphPreview
          url={deliverableUrl}
          previewPlaceholder={t("create-modal.preview-deliverable")}
          openLinkText={t("create-modal.view-deliverable")}
          showOpenLink
        />
      </div>

      <div className="mt-4 pt-1">
        <span className="xs-medium text-gray-100 text-uppercase">
          {t("create-modal.payment")}
        </span>

        <div className="mt-1 mb-2 d-flex flex-column align-items-center border border-radius-4 border-gray-800 comment">
          <If
            condition={!!deliverableUrl && !!paymentInfos}
            otherwise={
              <span className="p-5 sm-regular text-gray-600">
                {t("create-modal.select-a-deliverable")}
              </span>
            }
          >
            {paymentInfos?.map((info, index) => <PaymentInfo key={`payment-info-${index}`} {...info} />)}
          </If>
        </div>

        <If condition={!!deliverableUrl && !!paymentInfos}>
          <ContextualSpan context="info" color="blue-200">
            {t("create-modal.fees-info")}
          </ContextualSpan>
        </If>
      </div>
    </Modal>
  );
}