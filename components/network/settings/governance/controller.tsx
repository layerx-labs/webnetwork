import {useEffect, useState} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import NetworkGovernanceSettingsView from "components/network/settings/governance/view";

import {useAppState} from "contexts/app-state";
import {useNetworkSettings} from "contexts/network-settings";

import {IM_AM_CREATOR_NETWORK, LARGE_TOKEN_SYMBOL_LENGTH} from "helpers/constants";

import {StandAloneEvents} from "interfaces/enums/events";
import {Network} from "interfaces/network";
import {Token} from "interfaces/token";

import {useProcessEvent} from "x-hooks/api/events/use-process-event";
import {useUpdateNetwork} from "x-hooks/api/marketplace";
import {useDaoStore} from "x-hooks/stores/dao/dao.store";
import {useToastStore} from "x-hooks/stores/toasts/toasts.store";
import {useAuthentication} from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";
import useMarketplace from "x-hooks/use-marketplace";

interface GovernanceProps {
  address: string;
  tokens: Token[];
  network: Network;
  updateEditingNetwork: () => void;
}

export default function NetworkGovernanceSettings({
  network,
  tokens,
  address,
  updateEditingNetwork
}: GovernanceProps) {
  const { update: updateSession } = useSession();
  const { t } = useTranslation(["common", "custom-network"]);

  const [isClosing, setIsClosing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [networkToken, setNetworkToken] = useState<Token[]>();
  
  const { state } = useAppState();
  const marketplace = useMarketplace();
  const { processEvent } = useProcessEvent();
  const { addError, addSuccess } = useToastStore();
  const { service: daoService } = useDaoStore();
  const { updateWalletBalance, signMessage } = useAuthentication();
  const { handleCloseNetwork, handleChangeNetworkParameter } = useBepro();
  const {
    settings,
    tokens: settingsTokens,
    isAbleToClosed,
    forcedNetwork,
  } = useNetworkSettings();

  const symbol = forcedNetwork?.networkToken?.symbol
  const networkTokenSymbol =
    symbol?.length > LARGE_TOKEN_SYMBOL_LENGTH
      ? `${symbol.slice(0, LARGE_TOKEN_SYMBOL_LENGTH)}...`
      : symbol;

  const NetworkAmount = (title, description, amount, fixed = undefined) => ({
    title,
    description,
    amount,
    fixed
  });

  const networkAmounts = [
    NetworkAmount(t("custom-network:oracles-staked", { symbol: networkTokenSymbol, }),
                  t("custom-network:oracles-staked-description"),
                  forcedNetwork?.tokensLocked || 0),
    NetworkAmount(t("custom-network:open-bounties"),
                  t("custom-network:open-bounties-description"),
                  marketplace?.active?.totalOpenIssues || 0,
                  0),
    NetworkAmount(t("custom-network:total-bounties"),
                  t("custom-network:total-bounties-description"),
                  marketplace?.active?.totalIssues || 0,
                  0),
  ];

  const isCurrentNetwork = (!!network &&
    !!marketplace?.active &&
    network?.networkAddress === marketplace?.active?.networkAddress)

  function handleCloseMyNetwork() {
    if (
      !marketplace?.active ||
      !state.currentUser?.walletAddress ||
      !daoService
    )
      return;

    setIsClosing(true);

    handleCloseNetwork()
      .then(() => {
        return signMessage(IM_AM_CREATOR_NETWORK).then(async () => useUpdateNetwork({
          isClosed: true,
          creator: state.currentUser.walletAddress,
          networkAddress: network?.networkAddress
        }))
      })
      .then(() => {
        updateWalletBalance(true);
        if (isCurrentNetwork) marketplace.refresh();
        updateSession();
        return updateEditingNetwork();
      })
      .then(() => addSuccess(t("actions.success"), t("custom-network:messages.network-closed")))
      .catch((error) => addError(t("actions.failed"), t("custom-network:errors.failed-to-close-network", { error })))
      .finally(() => {
        setIsClosing(false);
      });
  }

  function getChangedParameters() {
    const changedParameters = [];

    if (!forcedNetwork) return changedParameters;

    const { parameters } = settings;

    const parametersKeys = [
      "draftTime",
      "disputableTime",
      "councilAmount",
      "percentageNeededForDispute",
      "cancelableTime",
      "oracleExchangeRate",
      "mergeCreatorFeeShare",
      "proposerFeeShare",
    ];

    changedParameters.push(...parametersKeys.filter(param => parameters[param].value !== +forcedNetwork[param]));

    return changedParameters;
  }

  function getChangedTokens() {
    const changedTokens = [];

    if (!settingsTokens?.allowedRewards?.length && !settingsTokens?.allowedTransactions?.length && !networkToken)
      return changedTokens;

    const getAddress = (token: Token) => token?.address;
    const hasEqualLength = (arr1, arr2) => arr1?.length === arr2?.length;
    const hasSameElements = (arr1, arr2) => arr1?.every(el => arr2?.find(el2 => el === el2));

    const allowedRewards = settingsTokens?.allowedRewards?.map(getAddress);
    const allowedTransactions = settingsTokens?.allowedTransactions?.map(getAddress);

    const networkRewards = networkToken?.filter(token => token?.network_tokens?.isReward).map(getAddress);
    const networkTransactions = 
      networkToken?.filter(token => token?.network_tokens?.isTransactional).map(getAddress);

    if (!hasEqualLength(allowedRewards, networkRewards))
      changedTokens.push("reward");
    else if (!hasSameElements(allowedRewards, networkRewards))
      changedTokens.push("reward");

    if (!hasEqualLength(allowedTransactions, networkTransactions))
      changedTokens.push("transactional");
    else if (!hasSameElements(allowedTransactions, networkTransactions))
      changedTokens.push("transactional");

    return changedTokens;
  }

  async function handleSubmit() {
    if (
      !state.currentUser?.walletAddress ||
      !daoService ||
      !forcedNetwork ||
      forcedNetwork?.isClosed ||
      isClosing
    )
      return;

    setIsUpdating(true);

    const changedParameters = getChangedParameters().map(param => ({
      param,
      value: settings?.parameters[param]?.value
    }));

    const networkAddress = network?.networkAddress;
    const failed = [];
    const success = {};

    const promises = await Promise.allSettled(changedParameters
      .map(async ({ param, value }) => 
        handleChangeNetworkParameter(param, value, networkAddress)
          .then(() => ({ param, value }))));

    promises.forEach((promise) => {
      if (promise.status === "fulfilled") success[promise.value.param] = promise.value.value;
      else failed.push(promise.reason);
    });

    if (failed.length) {
      addError(t("custom-network:errors.updating-values"), t("custom-network:errors.updated-parameters", {
            failed: failed.length,
      }));
      console.error(failed);
    }

    const successQuantity = Object.keys(success).length;

    if (successQuantity) {
      if(changedParameters.find(({ param }) => param === "draftTime"))
        await Promise.all([
          processEvent(StandAloneEvents.UpdateBountiesToDraft),
          processEvent(StandAloneEvents.BountyMovedToOpen)
        ]);

      await processEvent(StandAloneEvents.UpdateNetworkParams)
        .catch(error => console.debug("Failed to update network parameters", error));

      addSuccess(t("actions.success"), t("custom-network:messages.updated-parameters", {
          updated: successQuantity,
          total: promises.length,
      }));
    }

    const hasChangedTokens = !!getChangedTokens().length;

    if (!hasChangedTokens) return;

    const json = {
      creator: state.currentUser.walletAddress,
      handle: state.currentUser.login,
      networkAddress: network.networkAddress,
      allowedTokens: {
        transactional: settingsTokens?.allowedTransactions?.map((token) => token?.id).filter((v) => v),
        reward: settingsTokens?.allowedRewards?.map((token) => token?.id).filter((v) => v)
      }
    };

    const handleError = (error) => {
      addError(t("actions.failed"), t("custom-network:errors.failed-to-update-network", { error }));
      console.log(error);
    }

    signMessage(IM_AM_CREATOR_NETWORK)
      .then(async () => {
        await useUpdateNetwork(json)
          .then(async () => {
            if (isCurrentNetwork) marketplace.refresh();

            return updateEditingNetwork();
          })
          .then(() => {
            addSuccess(t("actions.success"), t("custom-network:messages.refresh-the-page"));
          })
          .catch(handleError);
      })
      .catch(handleError)
      .finally(() => setIsUpdating(false));
  }

  useEffect(() => {
    if(tokens.length > 0) 
      setNetworkToken(tokens.map((token) => ({
        ...token,
        isReward: !!token.network_tokens.isReward,
        isTransactional: !!token.network_tokens.isTransactional
      })));
  }, [tokens]);

  useEffect(() => {
    marketplace.refresh();
  }, []);

  return(
    <NetworkGovernanceSettingsView
      networkAmounts={networkAmounts}
      networkAddress={address}
      isAbleToClosed={isAbleToClosed}
      isClosing={isClosing}
      networkTokens={networkToken}
      isSubmitButtonVisible={
        !!settings?.validated && (!!getChangedParameters()?.length || !!getChangedTokens()?.length)
      }
      isSubmitButtonDisabled={!settings?.validated || isUpdating || forcedNetwork?.isClosed || isClosing}
      onCloseNetworkClick={handleCloseMyNetwork}
      onSaveChangesClick={handleSubmit}
    />
  );
}
