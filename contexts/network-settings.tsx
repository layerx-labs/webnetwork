import {createContext, useContext, useEffect, useMemo, useState} from "react";

import BigNumber from "bignumber.js";
import {isZeroAddress} from "ethereumjs-util";
import {useRouter} from "next/router";

import {
  DEFAULT_CANCEL_FEE,
  DEFAULT_CANCELABLE_TIME,
  DEFAULT_CLOSE_FEE,
  DEFAULT_COUNCIL_AMOUNT,
  DEFAULT_DISPUTE_TIME,
  DEFAULT_DRAFT_TIME,
  DEFAULT_MERGER_FEE,
  DEFAULT_ORACLE_EXCHANGE_RATE,
  DEFAULT_PERCENTAGE_FOR_DISPUTE,
  DEFAULT_PROPOSER_FEE,
  STATIC_URL_PATHS,
  UNSUPPORTED_CHAIN
} from "helpers/constants";
import {DefaultNetworkSettings} from "helpers/custom-network";
import {NetworkValidator} from "helpers/network";
import {RegistryValidator} from "helpers/registry";
import {lowerCaseCompare, toLower} from "helpers/string";

import {Color, Network, NetworkSettings, Theme} from "interfaces/network";
import {Token} from "interfaces/token";

import DAO from "services/dao-service";
import {WinStorage} from "services/win-storage";

import {useSearchNetworks} from "x-hooks/api/marketplace/use-search-networks";
import {useDaoStore} from "x-hooks/stores/dao/dao.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useBepro from "x-hooks/use-bepro";
import useMarketplace from "x-hooks/use-marketplace";
import useNetworkTheme from "x-hooks/use-network-theme";
import {useSettings} from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

import {baseApiImgUrl} from "../services/api";

const NetworkSettingsContext = createContext<NetworkSettings | undefined>(undefined);

const ALLOWED_PATHS = [
  "/new-marketplace",
  "/dashboard/[[...dashboardPage]]",
  "/administration",
  "/setup",
];
const TTL = 48 * 60 * 60 // 2 day
const storage = new WinStorage('create-network-settings', TTL, "localStorage");

export const NetworkSettingsProvider = ({ children }) => {
  const router = useRouter();

  /* NOTE - forced network might be renamed to `user marketplace`,
            referred to user nework when he access `/my-marketplace` page from/in another marketplace.
  */
  const [forcedNetwork, setForcedNetwork] = useState<Network>();
  const [networkSettings, setNetworkSettings] =
    useState<NetworkSettings>(JSON.parse(JSON.stringify(DefaultNetworkSettings)))
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [registryToken, setRegistryToken] = useState<Token>();
  const [forcedService, setForcedService] = useState<DAO>();

  const { settings } = useSettings();
  const { currentUser } = useUserStore();
  const marketplace = useMarketplace();
  const { DefaultTheme } = useNetworkTheme();
  const { getERC20TokenData, getTokensLockedInRegistryByAddress, getRegistryCreatorAmount } = useBepro();
  const { service: daoService, serviceStarting, ...daoStore } = useDaoStore();
  const { connectedChain } = useSupportedChain();

  const IPFS_URL = baseApiImgUrl.concat("/", settings?.urls?.ipfs);
  const LIMITS = {
    percentageNeededForDispute: settings?.networkParametersLimits?.disputePercentage,
    draftTime: settings?.networkParametersLimits?.draftTime,
    disputableTime: settings?.networkParametersLimits?.disputableTime,
    councilAmount: settings?.networkParametersLimits?.councilAmount
  };

  const isCreating = useMemo(() => ["/new-marketplace", "/setup"].includes(router.pathname), [router.pathname]);
  const needsToLoad = useMemo(() => ALLOWED_PATHS.includes(router.pathname), [router.pathname]);
  const network =
    useMemo(() =>
      forcedNetwork || marketplace?.active, [forcedNetwork, marketplace?.active]);

  function clearState () {
    setNetworkSettings((JSON.parse(JSON.stringify(DefaultNetworkSettings))));
  }
  function handlerValidateSettings(settings) {
    //Treasury
    const isTreasuryEmpty = settings?.treasury?.address?.value?.trim() === "";
    const isTreasuryZero = isZeroAddress(settings?.treasury?.address?.value);
    const ifEmptyThenUndefined = (condition: boolean) => isTreasuryEmpty ? undefined : condition;

    const validations = [
      ifEmptyThenUndefined(RegistryValidator("treasury", settings?.treasury?.address?.value)),
      ifEmptyThenUndefined(RegistryValidator("cancelFeePercentage", settings?.treasury?.cancelFee?.value)),
      ifEmptyThenUndefined(RegistryValidator("closeFeePercentage", settings?.treasury?.closeFee?.value))
    ];

    settings.treasury.address.validated = validations[0];
    settings.treasury.cancelFee.validated = validations[1];
    settings.treasury.closeFee.validated = validations[2];
    settings.treasury.validated = isTreasuryZero || validations.every(condition => condition !== false);

    //Parameters
    const parametersValidations = [
      NetworkValidator("draftTime", settings?.parameters?.draftTime?.value),
      NetworkValidator("councilAmount", settings?.parameters?.councilAmount?.value),
      NetworkValidator("disputableTime", settings?.parameters?.disputableTime?.value),
      NetworkValidator("percentageNeededForDispute", settings?.parameters?.percentageNeededForDispute?.value),
      NetworkValidator("oracleExchangeRate", settings?.parameters?.oracleExchangeRate?.value),
      NetworkValidator("mergeCreatorFeeShare", settings?.parameters?.mergeCreatorFeeShare?.value),
      NetworkValidator("proposerFeeShare", settings?.parameters?.proposerFeeShare?.value),
      NetworkValidator("cancelableTime", settings?.parameters?.cancelableTime?.value)
    ];

    settings.parameters.draftTime.validated = parametersValidations[0];
    settings.parameters.councilAmount.validated = parametersValidations[1];
    settings.parameters.disputableTime.validated = parametersValidations[2];
    settings.parameters.percentageNeededForDispute.validated = parametersValidations[3];
    settings.parameters.oracleExchangeRate.validated = parametersValidations[4];
    settings.parameters.mergeCreatorFeeShare.validated = parametersValidations[5];
    settings.parameters.proposerFeeShare.validated = parametersValidations[6];
    settings.parameters.cancelableTime.validated = parametersValidations[7];
    settings.parameters.validated = parametersValidations.every(condition => condition);

    return settings;
  }

  async function handerValidateForm(newState) {

    const tokensLockedValidate = [
      Fields.amount.validator(newState.tokensLocked?.locked, newState.tokensLocked?.needed)
    ].every(condition => condition);

    const detailsValidate = [
      newState.details.name.validated,
      newState.details.fullLogo.validated,
      newState.details.iconLogo.validated,
    ].every(condition => condition);

    newState.settings = await handlerValidateSettings(newState.settings);

    const settingsValidated = [
    !newState.settings?.theme?.similar?.length,
    newState.settings?.treasury?.validated,
    newState.settings?.parameters?.draftTime?.validated,
    newState.settings?.parameters?.disputableTime?.validated,
    newState.settings?.parameters?.percentageNeededForDispute?.validated,
    newState.settings?.parameters?.councilAmount?.validated,
    newState.settings?.parameters?.oracleExchangeRate?.validated,
    newState.settings?.parameters?.mergeCreatorFeeShare?.validated,
    newState.settings?.parameters?.proposerFeeShare?.validated,
    newState.settings?.parameters?.cancelableTime?.validated,
    ].every(condition => condition);

    const tokensValidated = [
      isCreating && newState.tokens?.settler?.trim() !== "" || true,
    ].every(condition => condition);

    newState.tokensLocked.validated = tokensLockedValidate;
    newState.details.validated = detailsValidate;
    newState.settings.validated = !!settingsValidated;
    newState.tokens.validated = tokensValidated;
    newState.isSettingsValidated = [
      tokensLockedValidate,
      detailsValidate,
      settingsValidated,
      tokensValidated
    ].every(condtion=> condtion);

    if(detailsValidate && isCreating){
      const data = Object.keys(newState)
                          .filter(key => newState[key]?.validated)
                          .reduce((obj, key) => {
                            obj[key] = newState[key]
                            return obj
                          }, {});

      storage.setItem(data);
    }

    return newState;
  }

  const setFields = async (field: string, value: unknown) => {
    const method = field.split('.')

    if(!method) return;

    const newState = { ...networkSettings };

    method.reduce((p, c)=>  c === method[method.length-1] ? p[c] = value : p[c], newState);

    const valitedState = await handerValidateForm(newState);

    setNetworkSettings(valitedState);
  }

  const Fields = {
    amount: {
      setter: (value: string) => setFields('tokensLocked.amount', value),
      validator: (locked: string, needed: string) => BigNumber(needed).gt(0) && BigNumber(locked).gte(needed)
    },
    name: {
      setter: async (value: string) => {
        await setFields('details.name', {value, validated: await Fields.name.validator(value)})
      },
      validator: async (value: string) => {
        if (value.trim() === "")
          return undefined;

        // Reserved names
        if (/bepro|taikai/gi.test(value) || STATIC_URL_PATHS.includes(value?.toLowerCase()))
          return false;

        const networksWithSameName = await useSearchNetworks({ name: value });

        // No networks with this name
        if (networksWithSameName.count === 0)
          return true;

        const currentChain = +connectedChain?.id;

        // Network with same name on this chain
        if (networksWithSameName.rows.some(({ chain_id }) => +chain_id === currentChain))
          return false;

        const currentWallet = currentUser?.walletAddress?.toLowerCase();

        // Network with same name on other chain and connected with the same creator wallet
        if (networksWithSameName.rows.find(({ creatorAddress }) => creatorAddress.toLowerCase() === currentWallet))
          return true;

        return false;
      }
    },
    description: {
      setter: (value: string) => setFields('details.description', value),
    },
    logo: {
      setter: (value, type: "full" | "icon") => {
        setFields(`details.${type}Logo`, {
          value,
          validated: value?.preview !== "" && value?.raw?.type?.includes("image/svg")
        });
      }
    },
    colors: {
      setter: (value: Color) => setFields(`settings.theme.colors.${value.label}`, value.code),
      validator: (value: Theme) => !value?.similar?.length
    },
    settlerTokenMinAmount: {
      setter: value => setFields(`tokens.settlerTokenMinAmount`, value)
    },
    settlerToken: {
      setter: value => setFields(`tokens.settler`, value)
    },
    allowedTransactions: {
      setter: value => setFields(`tokens.allowedTransactions`, value)
    },
    allowedRewards: {
      setter: value => setFields(`tokens.allowedRewards`, value)
    },
    treasury: {
      setter: value => setFields(`settings.treasury.address.value`, value)
    },
    cancelFee: {
      setter: value => setFields(`settings.treasury.cancelFee.value`, value)
    },
    closeFee: {
      setter: value => setFields(`settings.treasury.closeFee.value`, value)
    },
    parameter: {
      setter: value => setFields(`settings.parameters.${[value.label]}.value`, value.value)
    }
  };

  async function loadForcedService(): Promise<DAO> {
    if (!network ||
        toLower(daoService?.network?.contractAddress) === toLower(network?.networkAddress))
      return daoService;

    if (toLower(forcedService?.network?.contractAddress) === toLower(network?.networkAddress))
      return forcedService;

    const dao = new DAO({
      web3Connection: daoService?.web3Connection,
      skipWindowAssignment: true
    });

    await dao.start();

    await dao.loadNetwork(network?.networkAddress);

    return dao;
  }

  const cleanStorage = () => storage.removeItem();

  async function getTokenBalance() {
    const [tokensLockedInRegistry, registryCreatorAmount] = await Promise.all([
      getTokensLockedInRegistryByAddress(currentUser?.walletAddress),
      getRegistryCreatorAmount()
    ])

    return {
      locked: BigNumber(tokensLockedInRegistry).toFixed(),
      needed: BigNumber(registryCreatorAmount).toFixed(),
      validated: BigNumber(tokensLockedInRegistry).isGreaterThanOrEqualTo(registryCreatorAmount),
    }

  }

  async function updateTokenBalance(){
    const balance = await getTokenBalance()
    const tokensLocked = {...networkSettings.tokensLocked, ...balance}
    setFields('tokensLocked', tokensLocked)
    return tokensLocked;
  }

  async function loadDefaultSettings(): Promise<typeof DefaultNetworkSettings>{
    const defaultState = JSON.parse(JSON.stringify(DefaultNetworkSettings)); //Deep Copy, More: https://www.codingem.com/javascript-clone-object

    const balance = await getTokenBalance();

    defaultState.tokensLocked = {
      amount: '0',
      ...balance,
    }

    defaultState.settings.theme.colors = DefaultTheme();

    const validatedParameter = value => ({ value, validated: true });

    defaultState.settings.parameters = {
        draftTime: validatedParameter(DEFAULT_DRAFT_TIME),
        disputableTime: validatedParameter(DEFAULT_DISPUTE_TIME),
        percentageNeededForDispute: validatedParameter(DEFAULT_PERCENTAGE_FOR_DISPUTE),
        councilAmount: validatedParameter(DEFAULT_COUNCIL_AMOUNT),
        cancelableTime: validatedParameter(DEFAULT_CANCELABLE_TIME),
        oracleExchangeRate: validatedParameter(DEFAULT_ORACLE_EXCHANGE_RATE),
        proposerFeeShare: validatedParameter(DEFAULT_PROPOSER_FEE),
        mergeCreatorFeeShare: validatedParameter(DEFAULT_MERGER_FEE),
        validated: true
    };

    defaultState.settings.treasury.cancelFee = validatedParameter(DEFAULT_CANCEL_FEE);
    defaultState.settings.treasury.closeFee = validatedParameter(DEFAULT_CLOSE_FEE);
    defaultState.settings.treasury.validated = true;

    const storageData = storage.getItem();

    if(storageData){
      if(storageData?.details){
        const nameValue =  storageData?.details.name.value;
        defaultState.details.name =  {value: nameValue, validated: await Fields.name.validator(nameValue)};
        defaultState.details.description =  storageData?.details.description;
      }

      if(storageData?.settings)
        defaultState.settings = storageData?.settings;

      if(storageData?.tokens)
        defaultState.tokens = storageData?.tokens;
    }

    setNetworkSettings(defaultState);

    return defaultState;
  }

  async function loadNetworkSettings(): Promise<typeof DefaultNetworkSettings>{
    const defaultState = JSON.parse(JSON.stringify(DefaultNetworkSettings)); //Deep Copy, More: https://www.codingem.com/javascript-clone-object

    if (!forcedService?.network) return;

    const [
        treasury,
        councilAmount,
        disputableTime,
        draftTime,
        percentageNeededForDispute,
        mergeCreatorFeeShare,
        proposerFeeShare,
        oracleExchangeRate,
        cancelableTime,
        isNetworkAbleToBeClosed,
        tokensLocked
      ] = await Promise.all([
        forcedService.network.treasuryInfo(),
        forcedService.getNetworkParameter("councilAmount"),
        forcedService.getNetworkParameter("disputableTime"),
        forcedService.getNetworkParameter("draftTime"),
        forcedService.getNetworkParameter("percentageNeededForDispute"),
        forcedService.getNetworkParameter("mergeCreatorFeeShare"),
        forcedService.getNetworkParameter("proposerFeeShare"),
        forcedService.getNetworkParameter("oracleExchangeRate"),
        forcedService.getNetworkParameter("cancelableTime"),
        forcedService.isNetworkAbleToBeClosed(),
        forcedService.getTotalNetworkToken()
      ]);

    const validatedParameter = value => ({ value, validated: true });

    defaultState.settings.parameters = {
      draftTime: validatedParameter(+draftTime / 1000),
      disputableTime: validatedParameter(+disputableTime / 1000),
      percentageNeededForDispute: validatedParameter(percentageNeededForDispute),
      councilAmount: validatedParameter(+councilAmount),
      mergeCreatorFeeShare: validatedParameter(mergeCreatorFeeShare),
      proposerFeeShare: validatedParameter(proposerFeeShare),
      oracleExchangeRate: validatedParameter(oracleExchangeRate),
      cancelableTime: validatedParameter(+cancelableTime / 1000),
      validated: true
    };

    defaultState.settings.treasury.address = validatedParameter(treasury.treasury);
    defaultState.settings.treasury.cancelFee = validatedParameter(treasury.cancelFee);
    defaultState.settings.treasury.closeFee = validatedParameter(treasury.closeFee);

    defaultState.tokens.allowedTransactions = network?.tokens?.filter(token => token.isTransactional);
    defaultState.tokens.allowedRewards = network?.tokens?.filter(token => token.isReward);

    defaultState.details.name = validatedParameter(network?.name);
    defaultState.details.description = network?.description

    defaultState.details.fullLogo = validatedParameter({
        preview:`${IPFS_URL}/${network?.fullLogo}`,
        raw: undefined
    });

    defaultState.details.iconLogo = validatedParameter({
        preview:`${IPFS_URL}/${network?.logoIcon}`,
        raw: undefined
    });

    defaultState.isAbleToClosed = isNetworkAbleToBeClosed;
    defaultState.settings.theme.colors = network?.colors || DefaultTheme();
    defaultState.networkAddress = forcedNetwork?.networkAddress;

    setForcedNetwork((prev)=>({
      ...prev,
      tokensLocked: tokensLocked.toFixed(),
      councilAmount: councilAmount.toString(),
      disputableTime: +disputableTime / 1000,
      draftTime: +draftTime / 1000,
      percentageNeededForDispute: +percentageNeededForDispute,
      cancelableTime: +cancelableTime / 1000,
      oracleExchangeRate: oracleExchangeRate,
      proposerFeeShare: proposerFeeShare,
      mergeCreatorFeeShare: mergeCreatorFeeShare
    }));

    setNetworkSettings(defaultState);

    return defaultState;
  }

  useEffect(() => {
    if (!network || !daoService || serviceStarting)
      setForcedService(undefined);
    else if (+network?.chain?.chainId === +daoStore?.chainId)
      setForcedService(daoService);
    else if (+network?.chain?.chainId === +connectedChain?.id)
      loadForcedService()
        .then(setForcedService);
  }, [network, daoService, serviceStarting, connectedChain?.id]);

  useEffect(() => {
    if ([
      !currentUser?.walletAddress,
      !isCreating && lowerCaseCompare(networkSettings?.networkAddress, network?.networkAddress) &&
        !!network?.tokensLocked &&
        (!network?.name || !forcedService ||
          (!!networkSettings?.settings?.parameters?.councilAmount?.value && !!forcedNetwork?.councilAmount)),
      isCreating && !daoService?.registry?.token?.contractAddress,
      !needsToLoad,
      !settings
    ].some(c => c))
      return;

    setIsLoadingData(true);

    if (!isCreating && forcedNetwork)
      loadNetworkSettings().finally(()=> setIsLoadingData(false));
    else if(isCreating && +connectedChain?.id === +daoStore?.chainId)
      loadDefaultSettings().finally(()=> setIsLoadingData(false));
  }, [
    currentUser?.walletAddress,
    forcedService,
    network,
    isCreating,
    needsToLoad,
    router.pathname,
    daoService?.registry?.token?.contractAddress,
    settings
  ]);

  useEffect(() => {
    if (daoService?.registry?.contractAddress &&
      connectedChain?.name !== UNSUPPORTED_CHAIN &&
      +daoStore.chainId === +connectedChain?.id)
      getERC20TokenData(daoService.registry.token.contractAddress)
        .then(setRegistryToken)
        .catch(error => console.debug("Failed to load registry token", error));
  }, [daoService?.registry?.contractAddress, connectedChain?.name]);

  const memorizedValue = useMemo<NetworkSettings>(() => ({
    ...networkSettings,
    forcedNetwork,
    isLoadingData,
    setForcedNetwork,
    LIMITS,
    cleanStorage,
    updateTokenBalance,
    fields: Fields,
    registryToken,
    clearState
  }), [networkSettings, Fields, LIMITS, setForcedNetwork]);

  return (
    <NetworkSettingsContext.Provider value={memorizedValue}>
      {children}
    </NetworkSettingsContext.Provider>
  );
}

export const useNetworkSettings = () => {
  const context = useContext(NetworkSettingsContext);

  if (!context) {
    throw new Error("useNetworkSettings must be used within an NetworkSettingsContext");
  }

  return context;
}
