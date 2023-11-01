import { useTranslation } from "next-i18next";
import Link from "next/link";

import Modal from "components/modal";

interface NoNetworkTokenModalProps {
  isVisible: boolean;
}

export default function NoNetworkTokenModal({
  isVisible
}: NoNetworkTokenModalProps) {
  const { t } = useTranslation("common");

  return(
    <Modal
      show={isVisible}
      title={t("modals.no-network-token.title")}
    >
      <div className="text-center mt-4">
        <p className="xs-medium">
          {t("modals.no-network-token.please-contact")} {" "}
          <Link href={`/explore`} passHref>
            <a className="text-decoration-none">{t("modals.no-network-token.go-to-explore")}</a>
          </Link>.
        </p>
      </div>
    </Modal>
  );
}