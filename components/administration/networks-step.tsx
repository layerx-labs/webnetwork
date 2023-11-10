import {useState} from "react";

import {useTranslation} from "next-i18next";
import getConfig from "next/config";

import NetworksDropDown from "components/administration/networks-dropdown";
import Button from "components/button";
import ImageUploader from "components/image-uploader";
import InputNumber from "components/input-number";
import Step from "components/step";

import {useAppState} from "contexts/app-state";
import {useNetworkSettings} from "contexts/network-settings";

import { IM_AM_CREATOR_NETWORK } from "helpers/constants";
import {psReadAsText} from "helpers/file-reader";
import {formatNumberToCurrency} from "helpers/formatNumber";
import {getQueryableText, urlWithoutProtocol} from "helpers/string";

import { useUpdateNetwork, useSearchNetworks } from "x-hooks/api/network";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useAuthentication } from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";

const {publicRuntimeConfig: {urls: {homeURL}}} = getConfig();

export default function NetworksStep({
                                       step,
                                       currentStep,
                                       handleChangeStep,
    networks
}) {
  const { t } = useTranslation(["common", "custom-network"]);

  const [ isLoading, setIsLoading ] = useState(false);
  const [ isUpdatingNetwork, setIsUpdatingNetwork ] = useState(false);
  const [ isNetworkGovernor, setIsNetworkGovernor ] = useState(false);
  const [ selectedNetworkAddress, setSelectedNetworkAddress ] = useState<string>();

  const {state} = useAppState();
  const {
    loadNetwork,
    isNetworkGovernor: isNetworkGovernorDao,
    getNetworkParameter,
    getSettlerTokenData,
    setNetworkParameter,
    treasuryInfo
  } = useBepro();
  const { signMessage } = useAuthentication();
  const { addError, addSuccess } = useToastStore();
  const { service: daoService } = useDaoStore();
  const { forcedNetwork, details, fields, settings, setForcedNetwork } = useNetworkSettings();

  const MAX_PERCENTAGE_FOR_DISPUTE = +state.Settings?.networkParametersLimits?.disputePercentage?.max;
  const MIN_DRAFT_TIME = +state.Settings?.networkParametersLimits?.draftTime?.min;
  const MAX_DRAFT_TIME = +state.Settings?.networkParametersLimits?.draftTime?.max;
  const MIN_DISPUTE_TIME = +state.Settings?.networkParametersLimits?.disputableTime?.min;
  const MAX_DISPUTE_TIME = +state.Settings?.networkParametersLimits?.disputableTime?.max;
  const MIN_COUNCIL_AMOUNT = +state.Settings?.networkParametersLimits?.councilAmount?.min;
  const MAX_COUNCIL_AMOUNT = +state.Settings?.networkParametersLimits?.councilAmount?.max;

  const differentOrUndefined = (valueA, valueB) => valueA !== valueB ? valueA : undefined;

  const networkTokenSymbol = forcedNetwork?.networkToken?.symbol || t("misc.$token");
  const networkAlreadyLoaded = 
    selectedNetworkAddress === daoService?.network?.contractAddress && !!forcedNetwork?.councilAmount;
  const nameInputClass = forcedNetwork?.name === details?.name?.value || details?.name?.validated === undefined ? "" : (
    details?.name?.validated && "is-valid" || "is-invalid"
  );

  const parameters = settings?.parameters;

  const canSubmit = [
    forcedNetwork?.name !== details?.name?.value && details?.name?.validated,
    forcedNetwork?.description !== details?.description && details?.description?.trim() !== "",
    +forcedNetwork?.councilAmount !== parameters?.councilAmount?.value && parameters?.councilAmount?.validated,
    forcedNetwork?.disputableTime !== parameters?.disputableTime?.value && parameters?.disputableTime?.validated,
    forcedNetwork?.draftTime !== parameters?.draftTime?.value && parameters?.draftTime?.validated,
    forcedNetwork?.percentageNeededForDispute !== parameters?.percentageNeededForDispute?.value 
      && parameters?.percentageNeededForDispute?.validated,
    details?.iconLogo?.value?.raw && details?.iconLogo?.validated,
    details?.fullLogo?.value?.raw && details?.fullLogo?.validated,
    JSON.stringify(settings?.theme?.colors) !== JSON.stringify(forcedNetwork?.colors)
  ].some(condition => condition);

  function handleChange(address: string) {
    if (selectedNetworkAddress !== address) setSelectedNetworkAddress(address);
  }

  function handleNameChange(e) {
    fields.name.setter(e.target.value);
  }

  function handleNameBlur(e) {
    fields.name.validator(e.target.value);
  }

  function handleDescriptionChange(e) {
    fields.description.setter(e.target.value);
  }

  function handleIconChange(value) {
    fields.logo.setter(value, "icon");
  }

  function handleFullChange(value) {
    fields.logo.setter(value, "full");
  }

  function handleDisputableTimeChange({ floatValue }) {
    fields.parameter.setter({
      label: "disputableTime", 
      value: floatValue
    });
  }

  function handlePercentageNeededForDisputeChange({ floatValue }) {
    fields.parameter.setter({
      label: "percentageNeededForDispute", 
      value: floatValue
    });
  }

  function handleDraftTimeChange({ floatValue }) {
    fields.parameter.setter({
      label: "draftTime", 
      value: floatValue
    });
  }

  function handleCouncilAmountChange({ floatValue }) {
    fields.parameter.setter({
      label: "councilAmount", 
      value: floatValue
    });
  }

  function showTextOrDefault(text: string, defaultText: string) {
    return text.trim() === "" ? defaultText : text;
  }

  async function handleLoad() {
    if (networkAlreadyLoaded || !state.currentUser) return;

    try {
      setIsLoading(true);

      const network = await useSearchNetworks({ networkAddress: selectedNetworkAddress })
        .then(({ rows }) => rows[0]);

      if (network.networkAddress !== daoService.network.contractAddress)
        await loadNetwork(network.networkAddress);

      isNetworkGovernorDao(state.currentUser.walletAddress)
        .then(setIsNetworkGovernor)
        .catch(error => console.log(error));

      await Promise.all([
        getNetworkParameter("councilAmount"),
        getNetworkParameter("disputableTime"),
        getNetworkParameter("draftTime"),
        getNetworkParameter("oracleExchangeRate"),
        getNetworkParameter("mergeCreatorFeeShare"),
        getNetworkParameter("proposerFeeShare"),
        getNetworkParameter("percentageNeededForDispute"),
        treasuryInfo(),
        getSettlerTokenData()
      ])
      .then(([councilAmount, 
              disputableTime, 
              draftTime, 
              oracleExchangeRate, 
              mergeCreatorFeeShare,
              proposerFeeShare,
              percentageNeededForDispute, 
              treasury,
              networkToken]) => setForcedNetwork({
                ...network,
                councilAmount: councilAmount.toString(),
                disputableTime: +disputableTime / 1000,
                draftTime: +draftTime / 1000,
                oracleExchangeRate,
                mergeCreatorFeeShare,
                proposerFeeShare,
                percentageNeededForDispute: +percentageNeededForDispute,
                treasury,
                networkToken
              }));
    } catch(error) {
      console.error("Failed to load network data", error);
    }

    setIsLoading(false);
  }

  async function handleSubmit() {
    if (!state.currentUser?.walletAddress || !forcedNetwork) return;

    setIsUpdatingNetwork(true);

    const json = {
      override: true,
      creator: state.currentUser?.walletAddress,
      networkAddress: forcedNetwork.networkAddress,
      name: differentOrUndefined(details?.name?.value, forcedNetwork.name),
      description: differentOrUndefined(details?.description, forcedNetwork.description),
      logoIcon:
        details?.iconLogo?.value?.raw !== undefined
          ? (await psReadAsText(details?.iconLogo?.value?.raw)).toString()
          : undefined,
      fullLogo:
        details?.fullLogo?.value?.raw !== undefined
          ? (await psReadAsText(details?.fullLogo?.value?.raw)).toString()
          : undefined
    };

    const handleError = (error) => {
      addError(t("actions.failed"), t("custom-network:errors.failed-to-update-network", {
        error
      }));
      console.log(error);
    }

    await signMessage(IM_AM_CREATOR_NETWORK).then(async () => {
      await useUpdateNetwork(json)
      .then(() => {
        addSuccess(t("actions.success"), t("custom-network:messages.refresh-the-page"));
        setIsUpdatingNetwork(false);
      })
      .catch(handleError)
    })
    .catch(handleError)
    .finally(() => setIsUpdatingNetwork(false))


    if (forcedNetwork.draftTime !== parameters.draftTime.value)
      await setNetworkParameter("draftTime", parameters.draftTime.value).catch(console.log);

    if (forcedNetwork.disputableTime !== parameters.disputableTime.value)
      await setNetworkParameter("disputableTime", parameters.disputableTime.value)
        .catch(console.log);

    if (+forcedNetwork.councilAmount !== parameters.councilAmount.value)
      await setNetworkParameter("councilAmount", parameters.councilAmount.value)
        .catch(console.log);

    if (forcedNetwork.percentageNeededForDispute !== parameters.percentageNeededForDispute.value)
      await setNetworkParameter("percentageNeededForDispute",
                                parameters.percentageNeededForDispute.value).catch(console.log);
  }
 
  return (
    <Step
      title="Networks"
      index={step}
      activeStep={currentStep}
      handleClick={handleChangeStep}
    >
      <div className="row">
        <div className="col-11">
          <NetworksDropDown networks={networks} onChange={handleChange} />
        </div>

        <div className="col">
          <Button 
            disabled={isLoading || networkAlreadyLoaded}
            onClick={handleLoad}
          >
            Load
          </Button>
        </div>
      </div>

      <div className="row mt-4">
        {isLoading && <div>Loading...</div>}

        {(!isLoading && networkAlreadyLoaded) && 
          <>
            <hr />

            <div className="d-flex gap-20 mb-3 align-items-center">
              <div className="d-flex flex-column">
                <div className="d-flex gap-20">
                  <ImageUploader
                    name="logoIcon"
                    value={details.iconLogo.value}
                    error={details.iconLogo.validated === false}
                    onChange={handleIconChange}
                    description={
                      <>
                        {t("misc.upload")} <br />{" "}
                        {t("custom-network:steps.network-information.fields.logo-icon.label")}
                      </>
                    }
                  />

                  <ImageUploader
                    name="fullLogo"
                    value={details.fullLogo.value}
                    error={details.fullLogo.validated === false}
                    onChange={handleFullChange}
                    description=
                      {`${t("misc.upload")} ${t("custom-network:steps.network-information.fields.full-logo.label")}`}
                    lg
                  />
                </div>

                <p className="p-small text-gray mb-0 mt-2">
                  {t("custom-network:steps.network-information.logo-helper")}
                </p>
              </div>

              <div className="col ml-2">
                <p className="h3 text-white mb-3">
                  {showTextOrDefault(details?.name?.value, 
                                     t("custom-network:steps.network-information.fields.name.default"))}
                </p>
                <p className="caption-small text-light-gray mb-2">
                  {t("custom-network:steps.network-information.fields.name.temporary")}
                </p>
                <p className="caption-small text-gray">
                  {urlWithoutProtocol(homeURL)}/
                  <span className="text-primary">
                    {getQueryableText(details?.name?.value || 
                                      t("custom-network:steps.network-information.fields.name.default"))}
                  </span>
                </p>
              </div>
            </div>

            <div className="row mx-0 px-0 mb-3">
              <div className="col">
                <label htmlFor="display-name" className="caption-small mb-2">
                  {t("custom-network:steps.network-information.fields.name.label")}
                </label>

                <input
                  type="text"
                  name="display-name"
                  id="display-name"
                  placeholder={t("custom-network:steps.network-information.fields.name.default")}
                  className={`form-control ${nameInputClass}`}
                  value={details?.name?.value}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                />

                { details?.name?.validated === true &&
                  <p className="valid-feedback p-small mt-2 mb-0">
                    {t("custom-network:steps.network-information.fields.name.available")}
                  </p>
                }

                { details?.name?.validated === false &&
                  <p className="invalid-feedback p-small mt-2 mb-0">
                    {t("custom-network:steps.network-information.fields.name.unavailable")}
                  </p>
              }
              </div>
            </div>

            <div className="row mx-0 px-0 mb-3">
              <div className="col">
                <label htmlFor="description" className="caption-small mb-2">
                  {t("custom-network:steps.network-information.fields.description.label")}
                </label>

                <textarea
                  name="description"
                  id="description"
                  placeholder={t("custom-network:steps.network-information.fields.description.placeholder")}
                  cols={30}
                  rows={5}
                  className="form-control"
                  value={details?.description}
                  onChange={handleDescriptionChange}
                ></textarea>
              </div>
            </div>

            {isNetworkGovernor && (
              <div className="row px-0 mt-3">
                <div className="col-3">
                  <InputNumber
                    classSymbol={"text-light-gray"}
                    label={t("custom-network:dispute-time")}
                    symbol={t("misc.seconds")}
                    max={MAX_DISPUTE_TIME}
                    description={t("custom-network:errors.dispute-time", {
                      min: MIN_DISPUTE_TIME,
                      max: formatNumberToCurrency(MAX_DISPUTE_TIME, { maximumFractionDigits: 0 })
                    })}
                    value={parameters?.disputableTime?.value}
                    error={parameters?.disputableTime?.validated === false}
                    min={0}
                    placeholder={"0"}
                    thousandSeparator
                    decimalSeparator="."
                    decimalScale={18}
                    onValueChange={handleDisputableTimeChange}
                  />
                </div>

                <div className="col-3">
                  <InputNumber
                    classSymbol={"text-light-gray"}
                    label={t("custom-network:percentage-for-dispute")}
                    max={MAX_PERCENTAGE_FOR_DISPUTE}
                    description={t("custom-network:errors.percentage-for-dispute",
                      {max: MAX_PERCENTAGE_FOR_DISPUTE })}
                    symbol="%"
                    value={parameters?.percentageNeededForDispute?.value}
                    error={parameters?.percentageNeededForDispute?.validated === false}
                    placeholder={"0"}
                    thousandSeparator
                    decimalSeparator="."
                    decimalScale={18}
                    onValueChange={handlePercentageNeededForDisputeChange}
                  />
                </div>

                <div className="col-3">
                  <InputNumber
                    classSymbol={"text-light-gray"}
                    label={t("custom-network:redeem-time")}
                    max={MAX_DRAFT_TIME}
                    description={t("custom-network:errors.redeem-time", {
                      min: MIN_DRAFT_TIME,
                      max: formatNumberToCurrency(MAX_DRAFT_TIME, { maximumFractionDigits: 0 })
                    })}
                    symbol="seconds"
                    value={parameters?.draftTime?.value}
                    error={parameters?.draftTime?.validated === false}
                    min={0}
                    placeholder={"0"}
                    thousandSeparator
                    decimalSeparator="."
                    decimalScale={18}
                    onValueChange={handleDraftTimeChange}
                  />
                </div>

                <div className="col-3">
                  <InputNumber
                    classSymbol={"text-primary"}
                    label={t("custom-network:council-amount")}
                    symbol={networkTokenSymbol}
                  max={MAX_COUNCIL_AMOUNT}
                    description={t("custom-network:errors.council-amount", {
                      token: networkTokenSymbol,
                      min: formatNumberToCurrency(MIN_COUNCIL_AMOUNT, { maximumFractionDigits: 0 }),
                      max: formatNumberToCurrency(MAX_COUNCIL_AMOUNT, { maximumFractionDigits: 0 })
                    })}
                    value={parameters?.councilAmount?.value}
                    error={parameters?.councilAmount?.validated === false}
                  min={0}
                    placeholder={"0"}
                    thousandSeparator
                    decimalSeparator="."
                    decimalScale={18}
                    onValueChange={handleCouncilAmountChange}
                  />
                </div>
              </div>
            )}

            {(canSubmit && (
              <div className="d-flex flex-row justify-content-center mt-3 mb-2">
                <Button onClick={handleSubmit} disabled={isUpdatingNetwork}>
                  <span>{t("custom-network:save-settings")}</span>
                  {isUpdatingNetwork ? (
                    <span className="spinner-border spinner-border-xs ml-1" />
                  ) : (
                    ""
                  )}
                </Button>
              </div>
            )) ||
              ""}
          </>
        }
      </div>
    </Step>
  );
}
