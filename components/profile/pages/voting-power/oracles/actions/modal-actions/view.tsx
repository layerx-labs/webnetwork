import { Fragment } from "react";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import Modal from "components/modal";

import { ModalOraclesActionViewProps } from "interfaces/oracles-state";


export default function ModalOraclesActionView({
    renderInfo,
    show,
    handleCancel,
    handleConfirm
}: ModalOraclesActionViewProps) {
  const { t } = useTranslation(["common"]);
  
  return (
    <Modal
      title={renderInfo?.title}
      show={show}
      titlePosition="center"
      onCloseClick={handleCancel}
      footer={
        <div className="d-flex justify-content-between mt-3">
          <Button
            color="gray-800"
            className={`border-radius-4 border border-gray-700 sm-regular text-capitalize font-weight-medium 
                  py-2 px-3`}
            onClick={handleCancel}
            data-testid="modal-oracle-cancel-btn"
          >
            {t("actions.cancel")}
          </Button>
          <Button
            color="primary"
            className={`border-radius-4 border border-primary sm-regular text-capitalize font-weight-medium py-2 px-3`}
            onClick={handleConfirm}
            data-testid="modal-oracle-confirm-btn"
          >
            {t("actions.confirm")}
          </Button>
        </div>
      }
    >
      <p className="text-truncate caption-small text-uppercase text-center mb-2">
        {renderInfo?.caption}
      </p>
      <p className="text-truncate text-center h4">
        {renderInfo?.body?.split("/").map((sentence: string) => {
          const Component =
            ((sentence.startsWith("oracles") || sentence.startsWith("bepro")) &&
              "span") ||
            Fragment;

          return (
            <Fragment key={sentence}>
              <Component
                {...(sentence.startsWith("oracles") && {
                  className: "text-purple",
                })}
                {...(sentence.startsWith("bepro") && {
                  className: "text-primary",
                })}
              >
                {sentence.replace(/bepro|oracles|br/, "")}
              </Component>
              {sentence.startsWith("br") && <br />}
            </Fragment>
          );
        })}
      </p>
    </Modal>
  );
}
