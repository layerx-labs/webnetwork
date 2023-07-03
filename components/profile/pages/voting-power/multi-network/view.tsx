import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { ContextualSpan } from "components/contextual-span";
import If from "components/If";
import NetworkColumns from "components/profile/network-columns";
import NetworkItem from "components/profile/network-item/controller";

import { Curator } from "interfaces/curators";
import { Network } from "interfaces/network";

import PageItemView from "./page-item/view";
import VotingPowerRowView from "./voting-power-row/view";
interface VotingPowerMultiNetworkViewProps {
  networks: Curator[];
  network: Curator;
  handleNetwork: (network: Curator) => void;
  clearNetwork: () => void;
  goToNetwork: (network: Network) => void;
}

export default function VotingPowerMultiNetworkView({
  networks,
  network,
  handleNetwork,
  clearNetwork,
  goToNetwork,
}: VotingPowerMultiNetworkViewProps) {
  const { t } = useTranslation(["common", "profile"]);

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
        <VotingPowerRowView
          tokensLocked={tokensLocked}
          delegatedToMe={delegatedToMe}
          delegations={delegations}
          network={currentNetwork}
        />
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
                <VotingPowerRowView
                  tokensLocked={tokensLocked}
                  delegatedToMe={delegatedToMe}
                  delegations={delegations}
                  network={currentNetwork}
                  key={key}
                />
              </NetworkItem>
          );
        })
        : renderItem()}
    </>
  );
}
