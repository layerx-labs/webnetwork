import { useTranslation } from "next-i18next";

import Button from "components/button";
import If from "components/If";
import Modal from "components/modal";

type NewFeatureModalViewProps = {
  title: string;
  description: string;
  imageUrl: string;
  featureUrl: string;
  isVisible: boolean;
  onCloseClick: () => void;
  onVisitClick: () => void;
}

export function NewFeatureModalView({
  title,
  description,
  imageUrl,
  featureUrl,
  isVisible,
  onCloseClick,
  onVisitClick,
}: NewFeatureModalViewProps) {
  const { t } = useTranslation("common");

  return (
    <Modal
      show={isVisible}
      title={title}
      centerTitle={false}
      onCloseClick={onCloseClick}
      footer={
        <div className="col px-0 mx-0">
          <div className="d-flex align-items-center justify-content-between w-100">
            <Button 
              className="border-radius-4 bg-gray-800 border-gray-700 text-capitalize xs-medium py-2 px-3 mx-0"
              onClick={onCloseClick}
            >
              {t("actions.dismiss")}
            </Button>
            
            <If condition={!!featureUrl}>
              <Button 
                className="border-radius-4 text-capitalize xs-medium py-2 px-3" 
                onClick={onVisitClick}
              >
                {t("actions.visit")}
              </Button>
            </If>
          </div>
        </div>
      }
    >
      <div className="d-flex flex-column align-items-center gap-3 pb-3">
        <p className="text-center text-gray-400 base-medium font-weight-normal m-0">
          {description}
        </p>

        <If condition={!!imageUrl}>
          <img 
            className="w-100"
            alt={title}
            src={imageUrl}
          />
        </If>
      </div>
    </Modal>
  );
}