import {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";

import {isZeroAddress} from "ethereumjs-util";
import {useTranslation} from "next-i18next";
import {isAddress} from "web3-utils";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import {ContextualSpan} from "components/contextual-span";
import {FormGroup} from "components/form-group";
import {CallToAction} from "components/setup/call-to-action";
import {ContractField, ContractInput} from "components/setup/contract-input";
import {DeployBountyTokenModal} from "components/setup/deploy-bounty-token-modal";
import {DeployERC20Modal} from "components/setup/deploy-erc20-modal";

import { DAPPKIT_LINK } from "helpers/constants";
import { QueryKeys } from "helpers/query-keys";
import { REGISTRY_LIMITS, RegistryValidator } from "helpers/registry";

import {RegistryEvents} from "interfaces/enums/events";

import { RegistryParameters } from "types/dappkit";

import { useUpdateChain } from "x-hooks/api/chain";
import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import { useAddToken } from "x-hooks/api/token";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useBepro from "x-hooks/use-bepro";
import {useDao} from "x-hooks/use-dao";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";
import {useSettings} from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

import { lowerCaseCompare } from "../../helpers/string";

interface RegistrySetupProps {
  isVisible?: boolean;
  registryAddress: string;
}

interface TokenAllowed {
  transactional: boolean;
  reward: boolean;
}

enum ModalKeys {
  ERC20 = "ERC20",
  BountyToken = "BountyToken"
}

const defaultContractField: ContractField = {
  value: "",
  validated: null
};

export function RegistrySetup({
  isVisible,
  registryAddress
} : RegistrySetupProps) {
  const { t } = useTranslation(["setup", "common"]);

  const [treasury, setTreasury] = useState("");
  const [erc20, setErc20] = useState(defaultContractField);
  const [erc20MinAmount, setErc20MinAmount] = useState<string>();
  const [visibleModal, setVisibleModal] = useState<string>();
  const [isAllowingToken, setIsAllowingToken] = useState<string>();
  const [registry, setRegistry] = useState(defaultContractField);
  const [closeFeePercentage, setCloseFeePercentage] = useState("");
  const [cancelFeePercentage, setCancelFeePercentage] = useState("");
  const [isErc20Allowed, setIsErc20Allowed] = useState<TokenAllowed>();
  const [bountyToken, setBountyToken] = useState(defaultContractField);
  const [isDeployingRegistry, setisDeployingRegistry] = useState(false);
  const [isSettingDispatcher, setIsSettingDisptacher] = useState(false);
  const [bountyTokenDispatcher, setBountyTokenDispatcher] = useState<string>();
  const [lockAmountForNetworkCreation, setLockAmountForNetworkCreation] = useState("");
  const [networkCreationFeePercentage, setNetworkCreationFeePercentage] = useState("");
  const [registrySaveCTA, setRegistrySaveCTA] = useState(false);

  const { loadSettings } = useSettings();
  const { processEvent } = useProcessEvent();
  const { addError, addSuccess, addInfo } = useToastStore();
  const { service: daoService } = useDaoStore();
  const { start: startService } = useDao();
  const { handleDeployRegistry, handleSetDispatcher, handleChangeAllowedTokens } = useBepro();
  const { currentUser } = useUserStore();
  const { supportedChains, connectedChain, loadChainsDatabase, refresh: updateChains } = useSupportedChain();

  const { mutateAsync: mutateUpdateChain } = useReactQueryMutation({
    queryKey: QueryKeys.chains(),
    mutationFn: useUpdateChain,
    toastSuccess: "Chain registry updated",
    toastError: "Failed to update chain registry",
    onSettled: () => {
      loadChainsDatabase();
      updateChains();
    }
  });

  function isEmpty(value: string) {
    return value.trim() === "";
  }
  
  const hasRegistryAddress = !!registryAddress && isAddress(registryAddress) && !isZeroAddress(registryAddress);
  const needToSetDispatcher = hasRegistryAddress && bountyTokenDispatcher && 
    !lowerCaseCompare(registryAddress, bountyTokenDispatcher);

  const isDeployRegistryBtnDisabled = [
    treasury.trim() === "",
    hasRegistryAddress,
    !isAddress(treasury),
    !!exceedsFeesLimitsError(closeFeePercentage, "closeFeePercentage"),
    !!exceedsFeesLimitsError(cancelFeePercentage, "cancelFeePercentage"),
    !!exceedsFeesLimitsError(networkCreationFeePercentage, "networkCreationFeePercentage"),
    erc20.validated !== true,
    bountyToken.validated !== true,
    isEmpty(closeFeePercentage),
    isEmpty(cancelFeePercentage),
    isEmpty(lockAmountForNetworkCreation),
    isEmpty(networkCreationFeePercentage)
  ].some(c => c);

  function exceedsFeesLimitsError(fee, type: RegistryParameters) {
    const { min, max } = REGISTRY_LIMITS[type] || {};

    if (!isEmpty(fee) && !RegistryValidator(type, fee))
      return t("registry.errors.exceeds-limit", { min, max });

    return undefined;
  }

  function handleErc20Change(value: string, validated?: boolean) {
    setErc20(previous => ({ ...previous, value, validated }));
  }

  function handleBountyTokenChange(value: string, validated?: boolean) {
    setBountyToken(previous => ({ ...previous, value, validated}));
  }

  function handleShowERC20Modal() {
    setVisibleModal(ModalKeys.ERC20);
  }

  function handleShowBountyTokenModal() {
    setVisibleModal(ModalKeys.BountyToken);
  }

  function handleHideModal() {
    setVisibleModal(undefined);
  }

  async function deployRegistryContract() {
    try {
      if (isDeployRegistryBtnDisabled || !currentUser?.walletAddress) return;

      setisDeployingRegistry(true);

      const deployedAddress =
        await handleDeployRegistry( erc20.value,
                                    lockAmountForNetworkCreation,
                                    treasury,
                                    networkCreationFeePercentage,
                                    closeFeePercentage,
                                    cancelFeePercentage,
                                    bountyToken.value )
          .then(tx => tx?.contractAddress)
          .catch(() => null);

      if (!deployedAddress)
        throw new Error("Registry not deployed");

      setRegistry(previous => ({ ...previous, value: deployedAddress}));
      await setChainRegistry(deployedAddress);

      useAddToken({address: erc20.value, minAmount: erc20MinAmount || "1", chainId: +connectedChain?.id})
        .catch(error => console.debug("useAddToken: ", error));

      loadSettings(true);

      addSuccess(t("registry.success.deploy.title"), t("registry.success.deploy.content"));
    } catch (error) {
      addError(t("common:actions.failed"), t("registry.errors.deploy"));
      console.debug("Failed to deploy network registry", error);
    } finally {
      setisDeployingRegistry(false)
    }
  }

  function updateData(forcedValue?: string) {
    const updatedValue = value => ({ ...defaultContractField, value });

    if (!isAddress(forcedValue || registryAddress) || isZeroAddress(forcedValue || registryAddress))
      return;

    setRegistry(updatedValue(forcedValue || registryAddress));

    const registryObj = daoService?.registry;

    if (!registryObj) return;

    setErc20(updatedValue(registryObj.token.contractAddress));
    setBountyToken(updatedValue(registryObj.bountyToken.contractAddress));

    const getParameterWithoutProxy = param => registryObj.callTx(registryObj.contract.methods[param]());
    
    Promise.all([
      registryObj.treasury(),
      registryObj.lockAmountForNetworkCreation(),
      registryObj.networkCreationFeePercentage(),
      getParameterWithoutProxy("closeFeePercentage"),
      getParameterWithoutProxy("cancelFeePercentage"),
      registryObj.bountyToken.dispatcher(),
      registryObj.divisor,
      registryObj.token.contractAddress,
      registryObj.getAllowedTokens()
    ])
      .then(parameters => {
        setTreasury(parameters[0].toString());
        setLockAmountForNetworkCreation(parameters[1].toString());
        setNetworkCreationFeePercentage((+parameters[2]).toString());
        setCloseFeePercentage((+parameters[3]/+parameters[6]).toString());
        setCancelFeePercentage((+parameters[4]/+parameters[6]).toString());
        setBountyTokenDispatcher(parameters[5].toString().toLowerCase());

        const transactional = !!parameters[8].transactional.find(address => parameters[7] = address);
        const reward = !!parameters[8].reward.find(address => parameters[7] = address);

        setIsErc20Allowed({ transactional, reward });
      })
      .catch(console.debug);      
  }

  function setDispatcher() {
    setIsSettingDisptacher(true);

    handleSetDispatcher(bountyToken.value, registryAddress)
      .then(() => updateData())
      .then(() => addSuccess(t("common:actions.success"), t("registry.success.dispatcher-setted")))
      .catch(error => {
        addError(t("common:actions.failed"), t("registry.errors.dispatcher"));
        console.debug("Failed to set dispatcher", error);
      })
      .finally(() => setIsSettingDisptacher(false));
  }

  function allowToken(isTransactional: boolean) {
    handleChangeAllowedTokens([erc20.value], isTransactional)
      .then(txInfo => Promise.all([
        updateData(),
        processEvent(RegistryEvents.ChangeAllowedTokens, connectedChain?.registry, { 
          fromBlock: (txInfo as { blockNumber: number }).blockNumber 
        })
      ]))
      .then(() => addSuccess(t("common:actions.success"), t("registry.success.allow")))
      .catch(error => {
        addError(t("common:actions.failed"), t("registry.errors.allow"));
        console.debug("Failed to allow token", error);
      })
      .finally(() => setIsAllowingToken(undefined));
  }

  function allowAsTransactional() {
    setIsAllowingToken("transactional");
    allowToken(true);
  }

  function allowAsReward() {
    setIsAllowingToken("reward");
    allowToken(false);
  }

  function setChainRegistry(address = registryAddress) {
    const chain = supportedChains?.find(({chainId}) => +chainId === +connectedChain?.id);
    if (!chain || !address)
      return;

    if (!isAddress(address)) {
      addInfo(t("common:actions.info"), "Registry address value must be an address; Can't be 0x0");
      return;
    }

    return mutateUpdateChain({
      chainId: chain.chainId,
      registryAddress: address,
      lockAmountForNetworkCreation,
      networkCreationFeePercentage,
      closeFeePercentage,
      cancelFeePercentage,
    });
  }

  function _setRegistry(val) {
    const value = val(registry);
    setRegistry(value);

    if (!hasRegistryAddress && value.validated)
      updateData(value.value);
  }

  function setDefaults() {
    setErc20(defaultContractField);
    setRegistry(defaultContractField);
    setCloseFeePercentage("");
    setCancelFeePercentage("");
    setIsErc20Allowed(undefined);
    setBountyToken(defaultContractField);
    setBountyTokenDispatcher("");
    setLockAmountForNetworkCreation("");
    setNetworkCreationFeePercentage("");
  }

  useEffect(() => {
    if (!registryAddress || !daoService?.registry?.contractAddress || !isVisible) return;

    updateData();
  }, [registryAddress, daoService?.registry?.contractAddress, isVisible]);

  useEffect(() => {
    if (currentUser?.walletAddress) setTreasury(currentUser?.walletAddress);
  }, [currentUser?.walletAddress]);

  useEffect(() => {
    if (!supportedChains?.length || !connectedChain?.id)
      return;

    const chain = supportedChains.find(({chainId}) => chainId === +connectedChain?.id);

    if (!chain)
      return;

    setRegistrySaveCTA(chain?.registryAddress ? false : !!registryAddress);
  }, [connectedChain, supportedChains, registryAddress]);

  useEffect(() => {
    if (connectedChain?.id && !registryAddress)
      setDefaults();
  }, [connectedChain?.id, registryAddress]);

  useEffect(() => {
    if (!connectedChain?.registry || !isVisible) return;
    startService({
        chainId: +connectedChain.id,
        registryAddress: connectedChain.registry
    });
  }, [connectedChain, isVisible]);

  return(
    <div className="content-wrapper border-top-0 px-3 py-3">
      { hasRegistryAddress &&
        <ContextualSpan
          context="info"
          className="mb-3"
          isAlert
        >
          {t("registry.errors.already-saved")}
        </ContextualSpan>
      }

      { needToSetDispatcher &&
        <CallToAction
          call={t("registry.cta.dispatcher.call")}
          action={t("registry.cta.dispatcher.action")}
          onClick={setDispatcher}
          color="warning"
          disabled={!needToSetDispatcher}
          executing={isSettingDispatcher}
          isContractAction
          variant="registry"
        />
      }

      { isErc20Allowed?.transactional === false &&
        <CallToAction
          call={t("registry.cta.allow-transactional.call")}
          action={t("registry.cta.allow-transactional.action")}
          onClick={allowAsTransactional}
          color="info"
          disabled={!!isErc20Allowed?.transactional || !!isAllowingToken}
          executing={isAllowingToken === "transactional"}
          isContractAction
          variant="registry"
        />
      }

      { isErc20Allowed?.reward === false &&
        <CallToAction
          call={t("registry.cta.allow-reward.call")}
          action={t("registry.cta.allow-reward.action")}
          onClick={allowAsReward}
          color="info"
          disabled={!!isErc20Allowed?.reward || !!isAllowingToken}
          executing={isAllowingToken === "reward"}
          isContractAction
          variant="registry"
        />
      }

      {
        registrySaveCTA
          ? <CallToAction call="Please save your registry onto the connected chain"
                          action="Save" onClick={setChainRegistry} color="warning" disabled={false} executing={false}/>
          : ''
      }

      <Row className="align-items-center mb-3">
        <ContractInput
          field={registry}
          contractName="Network Registry"
          onChange={_setRegistry}
          mustBeAddress
          docsLink={`${DAPPKIT_LINK}classes/Network_Registry.html`}
          action={registry?.value && isAddress(registry?.value) && !isZeroAddress(registry?.value) ? {
              label: t("registry.actions.save-registry"),
              executing: false, disabled: false,
              onClick: () => setChainRegistry(registry.value) } : null 
          }
        />
      </Row>

      <Row className="align-items-center mb-3">
        <ContractInput
          field={erc20}
          onChange={setErc20}
          contractName={t("registry.fields.governance-token.label")}
          validator="isERC20"
          docsLink={`${DAPPKIT_LINK}classes/ERC20.html`}
          readOnly={hasRegistryAddress}
          action={{
            disabled: hasRegistryAddress,
            label: t("registry.actions.deploy-erc20"),
            executing: false,
            onClick: handleShowERC20Modal
          }}
        />
      </Row>

      <Row className="align-items-center mb-3">
        <ContractInput
          field={bountyToken}
          onChange={setBountyToken}
          contractName={t("registry.fields.nft-token.label")}
          validator="isBountyToken"
          docsLink={`${DAPPKIT_LINK}classes/BountyToken.html`}
          readOnly={hasRegistryAddress}
          action={{
            disabled: hasRegistryAddress,
            label: t("registry.actions.deploy-bounty-token"),
            executing: false,
            onClick: handleShowBountyTokenModal
          }}
        />
      </Row>

      <Row className="mb-3">
        <FormGroup
          label={t("registry.fields.treasury.label")}
          placeholder={t("registry.fields.treasury.placeholder")}
          description={t("registry.fields.treasury.description")}
          readOnly={hasRegistryAddress}
          value={treasury}
          onChange={setTreasury}
        />
      </Row>

      <Row className="mb-3">
        <FormGroup
          label={t("registry.fields.network-creation-amount.label")}
          placeholder="0"
          value={lockAmountForNetworkCreation}
          onChange={setLockAmountForNetworkCreation}
          variant="numberFormat"
          description={t("registry.fields.network-creation-amount.description")}
          readOnly={hasRegistryAddress}
        />

        <FormGroup
          label={t("registry.fields.network-creation-fee.label")}
          placeholder="0"
          symbol="%"
          value={networkCreationFeePercentage}
          onChange={setNetworkCreationFeePercentage}
          variant="numberFormat"
          decimalScale={7}
          description={t("registry.fields.network-creation-fee.description")}
          error={exceedsFeesLimitsError(networkCreationFeePercentage, "networkCreationFeePercentage")}
          readOnly={hasRegistryAddress}
        />

        <FormGroup
          label={t("registry.fields.close-bounty-fee.label")}
          placeholder="0"
          symbol="%"
          value={closeFeePercentage}
          onChange={setCloseFeePercentage}
          variant="numberFormat"
          decimalScale={7}
          description={t("registry.fields.close-bounty-fee.description")}
          error={exceedsFeesLimitsError(closeFeePercentage, "closeFeePercentage")}
          readOnly={hasRegistryAddress}
        />

        <FormGroup
          label={t("registry.fields.cancel-bounty-fee.label")}
          placeholder="0"
          symbol="%"
          value={cancelFeePercentage}
          onChange={setCancelFeePercentage}
          variant="numberFormat"
          decimalScale={7}
          description={t("registry.fields.cancel-bounty-fee.description")}
          error={exceedsFeesLimitsError(cancelFeePercentage, "cancelFeePercentage")}
          readOnly={hasRegistryAddress}
        />
      </Row>

      <Row className="mb-2">
        <Col xs="auto">
          <ContractButton
            disabled={isDeployRegistryBtnDisabled || isDeployingRegistry}
            withLockIcon={isDeployRegistryBtnDisabled}
            isLoading={isDeployingRegistry}
            onClick={deployRegistryContract}
            variant="registry"
          >
            <span>{t("setup:registry.actions.deploy-registry")}</span>
          </ContractButton>
        </Col>
      </Row>

      <DeployERC20Modal
        show={visibleModal === ModalKeys.ERC20}
        handleHide={handleHideModal}
        onChange={handleErc20Change}
        onChangeMinAmount={setErc20MinAmount}
      />

      <DeployBountyTokenModal
        show={visibleModal === ModalKeys.BountyToken}
        handleHide={handleHideModal}
        onChange={handleBountyTokenChange}
      />
    </div>
  );
}