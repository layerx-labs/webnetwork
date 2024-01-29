import { kebabCase } from "lodash";
import { useTranslation } from "next-i18next";

import CoinbaseWalletIcon from "assets/icons/wallets/coinbase-wallet-icon";
import MetamaskWalletIcon from "assets/icons/wallets/metamask-wallet-icon";

import Button from "components/button";
import Modal from "components/modal";
import WalletItem from "components/modals/no-wallet-modal/wallet-item/wallet-item.view";

import { Modal as ModalProps } from "types/modal";

interface AvailableWallet {
  name: string;
  links?: {
    download?: string;
    deepLink?: string;
  }
}
interface NoWalletModalViewProps {
  availableWallets: AvailableWallet[];
  isMobile?: boolean;
  onTryAgainClick: () => void;
}

export default function NoWalletModalView({
  show,
  availableWallets,
  isMobile = false,
  onCloseClick,
  onTryAgainClick,
}: Partial<ModalProps> & NoWalletModalViewProps) {
  const { t } = useTranslation("common");
  
  const walletsIcons = {
    metamask: <MetamaskWalletIcon height={50} />,
    coinbase: <CoinbaseWalletIcon height={50} />
  };

  const info = {
    "true": {
      title: t("modals.no-wallet-modal.title-mobile"),
      description: t("modals.no-wallet-modal.description-mobile"),
    },
    "false": {
      title: t("modals.no-wallet-modal.title"),
      description: t("modals.no-wallet-modal.description")
    }
  }[isMobile?.toString()];

  function getLabel (wallet: string) {
    const action = isMobile ? "open-in" : "install";
    return t(`modals.no-wallet-modal.${action}-${wallet}`);
  }

  function ModalFooter() {
    if (isMobile) return;

    return(
      <div className="mt-4 d-flex flex-row justify-content-around">
        <Button
          className="border-radius-4"
          onClick={onTryAgainClick}
        >
          {t("actions.try-again")}
        </Button>
      </div>
    );
  }

  return (
    <Modal
      centered
      aria-labelledby={`${kebabCase("WebThreeDialog")}-modal`}
      aria-describedby={`${kebabCase("WebThreeDialog")}-modal`}
      show={show}
      title={info.title}
      onCloseClick={onCloseClick}
      footer={<ModalFooter />}
    >
      <div className="row mx-0 align-items-center justify-content-center">
        <div className="col">
          <div className="row mb-2">
            <p className="p text-center fs-small">
              {info.description}
            </p>
          </div>

          <div className="row align-items-center justify-content-center gy-4">
            {availableWallets?.map(({ name, links}) => <WalletItem
              key={`wallet-item-${name}`}
              label={getLabel(name)}
              link={isMobile ? links?.deepLink : links?.download}
              icon={walletsIcons[name]}
            />)}
          </div>
        </div>
      </div>
    </Modal>
  );
}
