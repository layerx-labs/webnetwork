import {Col, Row} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import { ContextualSpan } from "components/contextual-span";
import {Divider} from "components/divider";
import If from "components/If";
import Delegations from "components/profile/pages/voting-power/delegations/controller";
import OraclesActions from "components/profile/pages/voting-power/oracles/actions/controller";
import OraclesDelegate from "components/profile/pages/voting-power/oracles/delegate/controller";
import TotalVotes from "components/profile/pages/voting-power/total-votes/view";

import { Balance } from "interfaces/balance-state";
import {Curator} from "interfaces/curators";
import {Network} from "interfaces/network";
import {SupportedChainData} from "interfaces/supported-chain-data";

interface VotingPowerNetworkViewProps {
  chains: SupportedChainData[];
  networks: Network[];
  locked: Curator[];
  delegatedToMe: Curator[];
  delegations: Curator[];
  isActionsEnabled: boolean;
  walletAddress: string;
  userBalance: Balance;
  userIsCouncil: boolean;
  userIsGovernor: boolean;
  isBalanceLoading?: boolean;
  isMarketplaceClosed?: boolean;
  handleUpdateWalletBalance: () => void;
}

export default function VotingPowerNetworkView({
  locked,
  delegatedToMe,
  delegations,
  isActionsEnabled,
  walletAddress,
  userBalance,
  userIsCouncil,
  userIsGovernor,
  isBalanceLoading,
  isMarketplaceClosed,
  handleUpdateWalletBalance,
}: VotingPowerNetworkViewProps) {
  const { t } = useTranslation("profile");

  return(
    <>
      <TotalVotes
        locked={locked}
        delegatedToMe={delegatedToMe}
      />

      <If condition={isMarketplaceClosed}>
        <Row className="mb-3 mx-0">
          <ContextualSpan context="warning" isAlert>
            {t("closed-marketplace-warning")}
          </ContextualSpan>
        </Row>
      </If>

      <Row className="mt-4 mb-4 mx-0 border border-gray-800 border-radius-4 p-4">
        <Col className="p-2">
          <If condition={!isActionsEnabled}>
            <div className="bg-gray-900 border-radius-4 px-3 py-5 text-center mb-4">
                 <span className="base-medium text-white font-weight-normal">
                   {t("select-marketplace-and-network")}
                 </span>
            </div>
          </If>

          <Row>
            <OraclesActions
              disabled={!isActionsEnabled}
              wallet={{
                address: walletAddress,
                balance: userBalance,
                isCouncil: userIsCouncil,
                isNetworkGovernor: userIsGovernor
              }}
              isBalanceLoading={isBalanceLoading}
              updateWalletBalance={handleUpdateWalletBalance}
            />

            <OraclesDelegate
              disabled={!isActionsEnabled}
              wallet={{
                address: walletAddress,
                balance: userBalance,
                isCouncil: userIsCouncil,
                isNetworkGovernor: userIsGovernor
              }}
              isBalanceLoading={isBalanceLoading}
              updateWalletBalance={handleUpdateWalletBalance}
              defaultAddress={null}
            />
          </Row>
        </Col>
      </Row>

      <Divider bg="gray-800" />

      <Delegations
        disabled={!isActionsEnabled || isBalanceLoading}
        delegations={delegations}
        updateWalletBalance={handleUpdateWalletBalance}
      />
    </>
  );
}