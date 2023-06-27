import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { ContextualSpan } from "components/contextual-span";
import Delegations from "components/profile/pages/voting-power/delegations/controller";
import If from "components/If";
import Indicator from "components/indicator";
import NetworkColumns from "components/profile/network-columns";
import NetworkItem from "components/profile/network-item";
import TotalVotes from "components/profile/pages/voting-power/total-votes.view";

import { Curator } from "interfaces/curators";
import { Network } from "interfaces/network";

interface VotingPowerMultiNetworkViewProps {
  networks: Curator[];
  goToNetwork: (network: Network) => void;
}

export default function VotingPowerMultiNetworkView({
  networks,
  goToNetwork,
}: VotingPowerMultiNetworkViewProps) {
  const { t } = useTranslation(["common", "profile"]);

  return (
    <>
      <div className="mt-5">
        <ContextualSpan context="info" isAlert isDismissable>
          <span>{t("profile:need-network-to-manage")}</span>
        </ContextualSpan>
      </div>

      <If condition={!!networks.length}>
        <div className="mt-5">
          <NetworkColumns
            columns={[
              t("profile:network-columns.network-name"),
              t("profile:network-columns.total-votes"),
              t("profile:network-columns.network-link"),
            ]}
          />

          {!!networks.length &&
            networks.map(({ tokensLocked, delegatedToMe, delegations, network }) => (
                <NetworkItem
                  key={network?.networkAddress}
                  type="network"
                  networkName={network?.name}
                  iconNetwork={network?.logoIcon}
                  primaryColor={network?.colors?.primary}
                  amount={BigNumber(tokensLocked).plus(delegatedToMe).toFixed()}
                  symbol={`${network?.networkToken?.symbol} ${t("misc.votes")}`}
                  variant="multi-network"
                  handleNetworkLink={() => goToNetwork(network)}
                >
                  <div className="col">
                    <TotalVotes
                      votesLocked={BigNumber(tokensLocked)}
                      votesDelegatedToMe={BigNumber(delegatedToMe)}
                      icon={
                        <Indicator bg={network?.colors?.primary} size="lg" />
                      }
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
                </NetworkItem>
              ))}
        </div>
      </If>
    </>
  );
}
