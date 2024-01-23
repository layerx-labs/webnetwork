import React, {useEffect, useState} from "react";
import {Spinner} from "react-bootstrap";

import {useTranslation} from "next-i18next";
import { useRouter } from "next/router";

import Button from "components/button";
import TermsAndConditions from "components/common/terms-and-conditions/view";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import Modal from "components/modal";
import SelectChainDropdown from "components/select-chain-dropdown";

import {UNSUPPORTED_CHAIN} from "helpers/constants";

import {SupportedChainData} from "interfaces/supported-chain-data";

import {useLoadersStore} from "x-hooks/stores/loaders/loaders.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useDao } from "x-hooks/use-dao";
import useMarketplace from "x-hooks/use-marketplace";
import useNetworkChange from "x-hooks/use-network-change";
import useSupportedChain from "x-hooks/use-supported-chain";

type typeError = { code?: number; message?: string }

export default function WrongNetworkModal() {
  const { pathname } = useRouter();
  const { t } = useTranslation("common");

  const [error, setError] = useState<string>("");
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);
  const [networkChain, setNetworkChain] = useState<SupportedChainData>(null);
  const [chosenSupportedChain, setChosenSupportedChain] = useState<SupportedChainData>(null);

  const { connect } = useDao();
  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { handleAddNetwork } = useNetworkChange();
  const { supportedChains, connectedChain } = useSupportedChain();
  const { wrongNetworkModal: show, loading, updateWrongNetworkModal } = useLoadersStore();

  const isRequired = pathname?.includes("new-marketplace");
  const canBeHided = !isRequired;

  async function selectSupportedChain(chain: SupportedChainData) {
    if (!chain)
      return;

    setChosenSupportedChain(chain);
  }

  function onClose () {
    updateWrongNetworkModal(false);
  }

  async function _handleAddNetwork() {
    setIsAddingNetwork(true);
    setError("");
    handleAddNetwork(chosenSupportedChain)
      .then(() => {
        if (!currentUser?.walletAddress)
          return connect();
      })
      .catch(error => {
        if ((error as typeError).code === -32602) {
          setError(t("modals.wrong-network.error-invalid-rpcUrl"));
        }
        if ((error as typeError).code === -32603) {
          setError(t("modals.wrong-network.error-failed-rpcUrl"));
        }
      })
      .finally(() => {
        setIsAddingNetwork(false);
        onClose()
      });
  }

  function updateNetworkChain() {
    if (supportedChains?.length && marketplace?.active?.chain_id) {
      const chain = supportedChains.find(({ chainId }) => +marketplace?.active?.chain_id === +chainId );

      setNetworkChain(chain);
      setChosenSupportedChain(chain);
    }
    else
      setNetworkChain(null);
  }

  function changeShowNetworkModal() {
    if (!supportedChains?.length || loading?.isLoading) {
      updateWrongNetworkModal(false);
      return;
    }
    const connectedWithSupportedChain = !!supportedChains?.find(e => e.chainId === +connectedChain.id)
    updateWrongNetworkModal([
      !connectedWithSupportedChain && isRequired,
      connectedChain?.name === UNSUPPORTED_CHAIN && isRequired
    ].some(c => c));
  }

  const isButtonDisabled = () => [isAddingNetwork].some((values) => values);

  useEffect(updateNetworkChain, [marketplace?.active?.chain_id, supportedChains]);
  useEffect(changeShowNetworkModal, [
    currentUser?.walletAddress,
    connectedChain?.id,
    supportedChains,
    loading,
    isRequired
  ]);

  if (show && !currentUser?.walletAddress)
    return <ConnectWalletButton asModal={true} />;

  return (
    <Modal
      title={t("modals.wrong-network.change-network")}
      titlePosition="center"
      titleClass="h4 text-white bg-opacity-100"
      show={show}
      onCloseClick={canBeHided ? onClose : undefined}
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
          onSelect={selectSupportedChain}
          isDisabled={isAddingNetwork}
          placeHolder={t("forms.select-placeholder-chain")}
        />

        <Button
          className="my-3"
          disabled={isButtonDisabled()}
          onClick={_handleAddNetwork}
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
