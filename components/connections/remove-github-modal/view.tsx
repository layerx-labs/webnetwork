import {Col, Row} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import Modal from "components/modal";

interface RemoveGithubAccountViewProps {
  show: boolean;
  isLoading: boolean;
  handle: string;
  walletAddress: string;
  onCloseClick: () => void;
  onOkClick: (...props) => void;
}

export default function RemoveGithubAccountView({
  show,
  isLoading,
  handle,
  walletAddress,
  onCloseClick,
  onOkClick,
}: RemoveGithubAccountViewProps) {
  const { t } = useTranslation(["profile", "common"]);

  const SpanPrimary = ({ text }) => (
    <span className="text-primary">{text}</span>
  );

  return (
    <Modal
      show={show}
      okLabel={t("common:actions.remove")}
      okColor="danger"
      cancelLabel={t("common:actions.cancel")}
      title={t("modals.remove-github.title")}
      onCloseClick={onCloseClick}
      onOkClick={onOkClick}
      isExecuting={isLoading}
    >
      <Row>
        <Col>
          <Row className="text-center">
            <span className="family-Regular font-weight-medium text-white">
              {t("common:actions.remove")} <SpanPrimary text={handle} />{" "}
              {t("modals.remove-github.account-from-wallet")}{" "}
              <SpanPrimary text={walletAddress} />
            </span>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}
