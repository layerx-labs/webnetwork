import { useEffect, useState } from "react";

import { useSession} from "next-auth/react";
import { useTranslation } from "next-i18next";

import NetworkGovernanceSettingsView from "components/network/settings/governance/view";

import { useNetworkSettings } from "contexts/network-settings";

import {LARGE_TOKEN_SYMBOL_LENGTH} from "helpers/constants";

import { NetworkEvents, StandAloneEvents } from "interfaces/enums/events";
import { Network } from "interfaces/network";
import { Token } from "interfaces/token";

import { NetworkParameters } from "types/dappkit";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import { useUpdateNetwork } from "x-hooks/api/marketplace";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import { useAuthentication } from "x-hooks/use-authentication";
import useBepro from "x-hooks/use-bepro";
import useMarketplace from "x-hooks/use-marketplace";

interface GovernanceProps {
  network: Network;
  updateEditingNetwork: () => void;
}

const getValidatedField =
 value => ({ value, validated: true });

export default function NetworkGovernanceSettings({
  network,
  updateEditingNetwork
}: GovernanceProps) {
  const { update: updateSession } = useSession();
  const { t } = useTranslation(["common", "custom-network"]);

  const [isClosing, setIsClosing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [networkToken, setNetworkToken] = useState<Token[]>();
  const [rewardTokens, setRewardTokens] = useState<Token[]>();
  const [transactionalTokens, setTransactionalTokens] = useState<Token[]>();
  const [parameters, setParameters] = useState({
    disputableTime: getValidatedField(network?.disputableTime),
    percentageNeededForDispute: getValidatedField(network?.percentageNeededForDispute),
    draftTime: getValidatedField(network?.draftTime),
    councilAmount: getValidatedField(network?.councilAmount),
    cancelableTime: getValidatedField(network?.cancelableTime),
    oracleExchangeRate: getValidatedField(network?.oracleExchangeRate),
    mergeCreatorFeeShare: getValidatedField(network?.mergeCreatorFeeShare),
    proposerFeeShare: getValidatedField(network?.proposerFeeShare),
  });

  const marketplace = useMarketplace();
  const { processEvent } = useProcessEvent();
  const { updateWalletBalance } = useAuthentication();
  const { handleCloseNetwork, handleChangeNetworkParameter } = useBepro();
  const {
    isAbleToClosed,
  } = useNetworkSettings();

  const { currentUser } = useUserStore();
  const { service: daoService } = useDaoStore();
  const { addError, addSuccess } = useToastStore();

  const symbol = network?.networkToken?.symbol;
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
                  network?.tokensLocked || 0),
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
    network?.networkAddress === marketplace?.active?.networkAddress);

  function handleParameterChange(param: NetworkParameters) {
    return (value: number, validated?: boolean) => {
      setParameters(previous => ({
        ...previous,
        [param]: { value, validated }
      }));
    }
  }

  function handleCloseMyNetwork() {
    if (
      !marketplace?.active ||
      !currentUser?.walletAddress ||
      !daoService
    )
      return;

    setIsClosing(true);

    handleCloseNetwork()
      .then(() => {
        return useUpdateNetwork({
          isClosed: true,
          creator: currentUser.walletAddress,
          networkAddress: network?.networkAddress
        });
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

    if (!network) return changedParameters;

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

    changedParameters.push(...parametersKeys.filter(param => +parameters[param].value !== +network[param]));

    return changedParameters;
  }

  function getChangedTokens() {
    const changedTokens = [];

    if (!rewardTokens?.length && !transactionalTokens?.length && !networkToken)
      return changedTokens;

    const getAddress = (token: Token) => token?.address;
    const hasEqualLength = (arr1, arr2) => arr1?.length === arr2?.length;
    const hasSameElements = (arr1, arr2) => arr1?.every(el => arr2?.find(el2 => el === el2));

    const allowedRewards = rewardTokens?.map(getAddress);
    const allowedTransactions = transactionalTokens?.map(getAddress);

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
      !currentUser?.walletAddress ||
      !daoService ||
      !network ||
      network?.isClosed ||
      isClosing
    )
      return;

    setIsUpdating(true);

    const changedParameters = getChangedParameters().map(param => ({
      param,
      value: parameters[param]?.value
    }));

    const networkAddress = network?.networkAddress;
    const failed = [];
    const success = {};
    const txBlocks = [];

    for (const { param, value } of changedParameters) {
      await handleChangeNetworkParameter(param, value, networkAddress)
        .then(tx => {
          txBlocks.push(tx.blockNumber);
          success[param] = param
        })
        .catch(error => {
          console.debug("Tx error: ", error);
          failed.push(param);
        });
    }

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

      await processEvent(NetworkEvents.NetworkParamChanged, network?.networkAddress, { fromBlock: txBlocks.at(0) })
        .catch(error => console.debug("Failed to update network parameters", error));

      addSuccess(t("actions.success"), t("custom-network:messages.updated-parameters", {
          updated: successQuantity,
          total: changedParameters.length,
      }));
    }

    const hasChangedTokens = !!getChangedTokens().length;

    if (!hasChangedTokens) return;

    const json = {
      creator: currentUser.walletAddress,
      handle: currentUser.login,
      networkAddress: network.networkAddress,
      allowedTokens: {
        transactional: transactionalTokens?.map((token) => token?.id).filter((v) => v),
        reward: rewardTokens?.map((token) => token?.id).filter((v) => v)
      }
    };

    const handleError = (error) => {
      addError(t("actions.failed"), t("custom-network:errors.failed-to-update-network", { error }));
      console.log(error);
    }

    await useUpdateNetwork(json)
      .then(async () => {
        if (isCurrentNetwork) marketplace.refresh();

        return updateEditingNetwork();
      })
      .then(() => {
        addSuccess(t("actions.success"), t("custom-network:messages.refresh-the-page"));
      })
      .catch(handleError)
      .finally(() => setIsUpdating(false));
  }

  function handleTokenChange(transactional: Token[], reward: Token[]) {
    setTransactionalTokens(transactional);
    setRewardTokens(reward);
  }

  const changedParameters = getChangedParameters();
  const isValidated = changedParameters.every(c => parameters[c]?.validated !== false) && 
    !!rewardTokens?.length &&
    !!transactionalTokens?.length;

  useEffect(() => {
    if(network?.tokens?.length > 0) 
      setNetworkToken(network?.tokens.map((token) => ({
        ...token,
        isReward: !!token.network_tokens.isReward,
        isTransactional: !!token.network_tokens.isTransactional
      })));
  }, [network?.tokens]);

  useEffect(() => {
    marketplace.refresh();
  }, []);

  return(
    <NetworkGovernanceSettingsView
      networkAmounts={networkAmounts}
      networkAddress={network?.networkAddress}
      isAbleToClosed={isAbleToClosed}
      isClosing={isClosing}
      networkTokens={networkToken}
      parameters={parameters}
      onParameterChange={handleParameterChange}
      isSubmitButtonVisible={isValidated && (!!changedParameters?.length || !!getChangedTokens()?.length)}
      isSubmitButtonDisabled={!isValidated || isUpdating || network?.isClosed || isClosing}
      onCloseNetworkClick={handleCloseMyNetwork}
      onSaveChangesClick={handleSubmit}
      onTokenChange={handleTokenChange}
    />
  );
}
