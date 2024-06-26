import {useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import {NetworkTokenConfig} from "components/custom-network/network-token-config";
import {Divider} from "components/divider";
import MultipleTokensDropdown from "components/multiple-tokens-dropdown";
import Step from "components/step";

import {useNetworkSettings} from "contexts/network-settings";

import { QueryKeys } from "helpers/query-keys";

import {StepWrapperProps} from "interfaces/stepper";
import {Token} from "interfaces/token";

import {useGetTokens} from "x-hooks/api/token";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";
import { useSettings } from "x-hooks/use-settings";
import useSupportedChain from "x-hooks/use-supported-chain";

export default function TokenConfiguration({
  activeStep,
  index,
  validated,
  handleClick,
  finishLabel,
  handleFinish
}: StepWrapperProps) {
  const { t } = useTranslation(["common", "custom-network"]);
  
  const [createNetworkAmount, setCreateNetworkAmount] = useState<string>();
  const [allowedRewardTokens, setAllowedRewardTokens] = useState<Token[]>([]);
  const [selectedRewardTokens, setSelectedRewardTokens] = useState<Token[]>([]);
  const [allowedTransactionalTokens, setAllowedTransactionalTokens] = useState<Token[]>();
  const [selectedTransactionalTokens, setSelectedTransactionalTokens] = useState<Token[]>();
  
  const { settings } = useSettings();
  const { currentUser } = useUserStore();
  const { tokens, fields, tokensLocked, registryToken } = useNetworkSettings();
  const { service: daoService } = useDaoStore();
  const { connectedChain } = useSupportedChain();

  const connectedChainId = connectedChain?.id;

  function processTokens(tokens) {
    const { transactional, reward } = tokens.reduce((acc, curr) => ({
      transactional: curr.isTransactional ? [...acc.transactional, curr]: acc.transactional,
      reward: curr.isReward ? [...acc.reward, curr]: acc.reward,
    }), {
      transactional: [],
      reward: []
    });
    
    setAllowedTransactionalTokens(transactional);
    setAllowedRewardTokens(reward);
    return tokens;
  }

  useReactQuery(QueryKeys.tokensByChain(connectedChainId),
                () => useGetTokens({ chainId: connectedChainId }).then(processTokens),
                {
                  enabled: !!connectedChainId
                });

  const networkTokenSymbol = settings?.beproToken?.symbol || t("misc.$token");

  function addTransactionalToken(newToken: Token) {
    setAllowedTransactionalTokens([
      ...allowedTransactionalTokens,
      newToken
    ]);
  }

  function addRewardToken(newToken: Token) {
    setAllowedRewardTokens([
      ...allowedRewardTokens,
      newToken
    ]);
  }

  function changeSelectedTransactionalTokens(newToken: Token[]) {
    setSelectedTransactionalTokens(newToken);
  }

  function changeSelectedRewardTokens(newToken: Token[]) {
    setSelectedRewardTokens(newToken);
  }

  // LoadData from context
  useEffect(() => {
    if (!daoService) return;
    if(!selectedRewardTokens?.length && tokens?.allowedRewards)
      setSelectedRewardTokens(tokens.allowedRewards);

    if(!selectedTransactionalTokens?.length && tokens?.allowedTransactions)
      setSelectedTransactionalTokens(tokens.allowedTransactions);
  }, [daoService, tokens?.settler]);

  useEffect(() => {
    fields.allowedRewards.setter(selectedRewardTokens);
  }, [selectedRewardTokens])

  useEffect(() => {
    fields.allowedTransactions.setter(selectedTransactionalTokens);
  }, [selectedTransactionalTokens])

  useEffect(() => {
    if(!currentUser?.walletAddress || !daoService || !BigNumber(tokensLocked.needed).gt(0)) return

    daoService.getRegistryParameter("networkCreationFeePercentage").then(createFee => {
      setCreateNetworkAmount(BigNumber(createFee).div(100).multipliedBy(tokensLocked.needed).toFixed())
    })

  }, [currentUser?.walletAddress, tokensLocked.needed])
  
  function handleEmptyTokens (tokens: Token[]) {
    if(tokens?.length === 0) return [settings?.beproToken];

    return tokens;
  }

  return (
    <Step
      title={t("custom-network:steps.token-configuration.title")}
      index={index}
      activeStep={activeStep}
      validated={validated}
      handleClick={handleClick}
      handleFinish={handleFinish}
      finishLabel={finishLabel}
    >
      <NetworkTokenConfig
        onChange={fields.settlerToken.setter}
        registryToken={registryToken}
        settlerToken={tokens?.settler}
      />

      <Divider />

      <MultipleTokensDropdown
        label={t("select-multiple.allowed-transactional-tokens")}
        description={t("select-multiple.add-transactional-tokens")}
        addToken={addTransactionalToken}
        tokens={handleEmptyTokens(allowedTransactionalTokens)}
        canAddToken={false}
        selectedTokens={selectedTransactionalTokens}
        changeSelectedTokens={changeSelectedTransactionalTokens}
      />

      <MultipleTokensDropdown
        label={t("select-multiple.allowed-reward-tokens")}
        description={t("select-multiple.add-reward-tokens")}
        addToken={addRewardToken}
        tokens={handleEmptyTokens(allowedRewardTokens)}
        canAddToken={false}
        selectedTokens={selectedRewardTokens}
        changeSelectedTokens={changeSelectedRewardTokens}
      />
     {validated && (
        <>
        <span className="p-small text-warning mb-2">
          {t("custom-network:network-create-warning")}
        </span>
        <span className="p-small text-warning mb-4">
        {t("custom-network:network-amount-to-create", {
              amount: createNetworkAmount,
              symbol: networkTokenSymbol,
              totalAmount: tokensLocked.locked
        })}
        </span>
        </>
      )}
    </Step>
  );
}
