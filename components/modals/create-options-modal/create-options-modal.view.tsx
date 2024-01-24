import { useTranslation } from "next-i18next";

import SelectableCard from "components/common/selectable-card/selectable-card.view";
import Modal from "components/modal";

interface CreateOptionsModalViewProps {
  show: boolean;
  onCloseClick: () => void;
  onContinueClick: () => void;
  isContinueButttonDisabled?: boolean;
  options: any[];
  selectedOption?: number;
  setSelectedOption: (option: number) => void;
  hideSubTitle?: boolean;
}

export default function CreateOptionsModalView ({
  show,
  onCloseClick,
  onContinueClick,
  isContinueButttonDisabled,
  options,
  selectedOption,
  setSelectedOption,
  hideSubTitle,
}: CreateOptionsModalViewProps) {
  const { t } = useTranslation("common");
  
  return(
    <Modal
      title={t("modals.create-marketplace-options.title")}
      subTitle={hideSubTitle ? "" : t("modals.create-marketplace-options.subtitle")}
      show={show}
      onCloseClick={onCloseClick}
      onOkClick={onContinueClick}
      okDisabled={isContinueButttonDisabled}
      centerTitle={false}
      cancelLabel={t("actions.cancel")}
      okLabel={t("actions.continue")}
      size="xl"
      backdrop
      onBackdropClick={onCloseClick}
    >
      <div className="row mx-0 mx-md-n3 gy-4 justify-content-center">
        {options.map((opt, i) => <div className="col-11 col-lg px-0 px-md-2" key={`options-modal-${i}`}>
          <SelectableCard
            isSelected={selectedOption === i}
            icon={<opt.icon width="100%" height="100%" color={selectedOption === i ? "white" : "gray"}/>}
            title={opt.title}
            description={opt.description}
            onClick={() => setSelectedOption(i)}
          />
        </div>)}
      </div>
    </Modal>
  );
}