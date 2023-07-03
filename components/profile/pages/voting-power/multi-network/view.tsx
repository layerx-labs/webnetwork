import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import Indicator from "components/indicator";
import NetworkColumns from "components/profile/network-columns";
import NetworkItem from "components/profile/network-item/controller";
import Delegations from "components/profile/pages/voting-power/delegations/controller";
import TotalVotes from "components/profile/pages/voting-power/total-votes/view";

import { Curator, Delegation } from "interfaces/curators";
import { Network } from "interfaces/network";

import PageItemView from "./page-item/view";
interface VotingPowerMultiNetworkViewProps {
  networks: Curator[];
  network: Curator;
  handleNetwork: (network: Curator) => void;
  clearNetwork: () => void;
  goToNetwork: (network: Network) => void;
}
interface VotingPowerDataProps {
  tokensLocked: string;
  delegatedToMe: string;
  delegations: Delegation[];
  network: Network;
  key?: number;
}

export default function VotingPowerMultiNetworkView({
  networks,
  network,
  handleNetwork,
  clearNetwork,
  goToNetwork,
}: VotingPowerMultiNetworkViewProps) {
  const { t } = useTranslation(["common", "profile"]);

  function renderVotingPowerData({
    tokensLocked,
    delegatedToMe,
    delegations,
    network,
    key,
  }: VotingPowerDataProps) {
    return (
      <div className="col-12" key={key}>
        <TotalVotes
          votesLocked={BigNumber(tokensLocked)}
          votesDelegatedToMe={BigNumber(delegatedToMe)}
          icon={<Indicator bg={network?.colors?.primary} size="lg" />}
          tokenColor={network?.colors?.primary}
          tokenName={network?.networkToken?.name}
          tokenSymbol={network?.networkToken?.symbol}
          votesSymbol={`${network?.networkToken?.symbol} ${t("misc.votes")}`}
          variant="multi-network"
        />

        <div className="mt-3">
          <Delegations
            type="toOthers"
            delegations={delegations}
            variant="multi-network"
            tokenColor={network?.colors?.primary}
          />
        </div>
      </div>
    );
  }

  function renderItem() {
    if (!network) return null;
    const {
      tokensLocked,
      delegatedToMe,
      delegations,
      network: currentNetwork,
    } = network;

    return (
      <PageItemView
        goToNetwork={() => goToNetwork(currentNetwork)}
        clearNetwork={clearNetwork}
        name={network?.network?.name}
      >
        {renderVotingPowerData({
          tokensLocked,
          delegatedToMe,
          delegations,
          network: currentNetwork,
        })}
      </PageItemView>
    );
  }

  return (
    <>
      <div className="mt-5">
        <ContextualSpan context="info" isAlert isDismissable>
          <span>{t("profile:need-network-to-manage")}</span>
        </ContextualSpan>
      </div>

      <If condition={!!networks.length && !network}>
        <div className="mt-5">
          <NetworkColumns
            columns={[
              t("profile:network-columns.network-name"),
              t("profile:network-columns.total-votes"),
              t("profile:network-columns.network-link"),
              "",
            ]}
          />
        </div>
      </If>

      {!!networks.length && !network
        ? networks.map((curator, key) => {
          const {
              tokensLocked,
              delegatedToMe,
              delegations,
              network: currentNetwork,
            } = curator;
          return (
              <NetworkItem
                key={currentNetwork?.networkAddress}
                type="network"
                networkName={currentNetwork?.name}
                iconNetwork={currentNetwork?.logoIcon}
                primaryColor={currentNetwork?.colors?.primary}
                amount={BigNumber(tokensLocked).plus(delegatedToMe).toFixed()}
                symbol={`${currentNetwork?.networkToken?.symbol} ${t("misc.votes")}`}
                variant="multi-network"
                handleNetworkLink={() => goToNetwork(currentNetwork)}
                handleToggleTabletAndMobile={() => handleNetwork(curator)}
              >
                {renderVotingPowerData({
                  tokensLocked,
                  delegatedToMe,
                  delegations,
                  network: currentNetwork,
                  key,
                })}
              </NetworkItem>
          );
        })
        : renderItem()}
    </>
  );
}