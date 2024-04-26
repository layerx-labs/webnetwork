import {Col, Row} from "react-bootstrap";

import { useTranslation } from "next-i18next";

import ChainFilter from "components/lists/filters/chain/controller";
import MarketplaceFilter from "components/lists/filters/marketplace/controller";
import NoNetworkTokenModal from "components/modals/no-network-token/no-network-token-modal.view";
import DashboardLayout from "components/profile/dashboard-layout";
import VotingPowerNetwork from "components/profile/pages/voting-power/network/controller";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

import {Network} from "interfaces/network";
import {SupportedChainData} from "interfaces/supported-chain-data";

export interface VotingPowerPageViewProps {
  selectedNetwork: Network;
  selectedChain: SupportedChainData;
  chains: SupportedChainData[];
  networks: Network[];
  isNoNetworkTokenModalVisible?: boolean;
  onNetworkSelected: (network: string | number) => void;
  onChainSelected: (chain: string | number) => void;
}
export default function VotingPowerPageView({
  selectedNetwork,
  selectedChain,
  chains,
  networks,
  isNoNetworkTokenModalVisible,
  onNetworkSelected,
  onChainSelected,
}: VotingPowerPageViewProps) {
  const { t } = useTranslation(["common", "profile"]);

  return (
    <DashboardLayout>
      <ReadOnlyButtonWrapper>
        <Col xs={12}>
          <Row className="mb-3">
            <Col>
              <h3 className="text-white font-weight-500">
                {t("profile:voting-power")}
              </h3>
            </Col>

            <Col xs="12" md="auto" className="mt-2 mb-2 mt-md-0 mb-md-0">
              <MarketplaceFilter
                marketplaces={networks}
                onChange={onNetworkSelected}
                label={false}
              />
            </Col>

            <Col xs="12" md="auto">
              <ChainFilter
                chain={selectedChain}
                chains={chains}
                onChange={onChainSelected}
                label={false}
              />
            </Col>
          </Row>

          <NoNetworkTokenModal
            isVisible={isNoNetworkTokenModalVisible}
          />

          <Row>
            <Col>
              <VotingPowerNetwork
                selectedNetwork={selectedNetwork}
                selectedChain={selectedChain}
              />
            </Col>
          </Row>
        </Col>
      </ReadOnlyButtonWrapper>
    </DashboardLayout>
  );
}
