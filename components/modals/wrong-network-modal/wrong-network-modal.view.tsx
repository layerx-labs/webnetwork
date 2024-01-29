import { Spinner } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import TermsAndConditions from "components/common/terms-and-conditions/view";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import Modal from "components/modal";
import SelectChainDropdown from "components/select-chain-dropdown";

import { SupportedChainData } from "interfaces/supported-chain-data";

interface WrongNetworkModalViewProps {
  walletAddress: string;
  error?: string;
  networkChain: SupportedChainData;
  show?: boolean;
  isAddingNetwork?: boolean;
  isButtonDisabled?: boolean;
  onCloseClick: () => void;
  onButtonClick: () => void;
  onSelectChain: (chain: SupportedChainData) => void;
}
export default function WrongNetworkModalView ({
  walletAddress,
  error,
  networkChain,
  show,
  isAddingNetwork,
  isButtonDisabled,
  onCloseClick,
  onButtonClick,
  onSelectChain,
}: WrongNetworkModalViewProps) {
  const { t } = useTranslation("common");

  if (show && !walletAddress)
    return <ConnectWalletButton asModal={true} />;

  return(
    <Modal
      title={t("modals.wrong-network.change-network")}
      titlePosition="center"
      titleClass="h4 text-white bg-opacity-100"
      show={show}
      onCloseClick={onCloseClick}
    >
      <div className="d-flex flex-column text-center align-items-center">
        <strong className="caption-small d-block text-uppercase text-white-50 mb-3 pb-1">
          {networkChain ? t("modals.wrong-network.connect-to-network-chain") : t("modals.wrong-network.please-connect")}
        </strong>

        {!isAddingNetwork ? '' :
          <Spinner
            className="text-primary align-self-center p-2 mt-1 mb-2"
            style={{ width: "5rem", height: "5rem" }}
            animation="border"
          />
        }

        <SelectChainDropdown
          defaultChain={networkChain}
          onSelect={onSelectChain}
          isDisabled={isAddingNetwork}
          placeHolder={t("forms.select-placeholder-chain")}
        />

        <Button
          className="my-3"
          disabled={isButtonDisabled}
          onClick={onButtonClick}
        >
          {t("modals.wrong-network.change-network")}
        </Button>

        {error && (
          <p className="caption-small text-uppercase text-danger">{error}</p>
        )}

        <TermsAndConditions />
      </div>
    </Modal>
  );
}