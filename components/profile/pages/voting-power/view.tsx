import {Col, Row} from "react-bootstrap";

import { useTranslation } from "next-i18next";

import SelectNetwork from "components/bounties/select-network";
import NoNetworkTokenModal from "components/modals/no-network-token/no-network-token-modal.view";
import ChainSelector from "components/navigation/chain-selector/controller";
import VotingPowerNetwork from "components/profile/pages/voting-power/network/controller";
import ProfileLayout from "components/profile/profile-layout";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

import {Network} from "interfaces/network";

interface VotingPowerPageViewProps {
  handleMarketplaceChange: (network: Network) => void;
  isNoNetworkTokenModalVisible?: boolean;
}
export default function VotingPowerPageView({
  isNoNetworkTokenModalVisible,
  handleMarketplaceChange,
}: VotingPowerPageViewProps) {
  const { t } = useTranslation(["common", "profile"]);

  return (
    <ProfileLayout>
      <ReadOnlyButtonWrapper>
        <Col xs={12}>
          <Row className="mb-3">
            <Col>
              <h3 className="text-white font-weight-500">
                {t("profile:voting-power")}
              </h3>
            </Col>

            <Col xs="12" md="auto">
              <SelectNetwork
                filterByConnectedChain
                hideLabel
                isClearable={false}
                onChange={handleMarketplaceChange}
              />
            </Col>

            <Col xs="12" md="auto">
              <ChainSelector
                placeholder="Select network"
              />
            </Col>
          </Row>

          <NoNetworkTokenModal
            isVisible={isNoNetworkTokenModalVisible}
          />

          <VotingPowerNetwork />
        </Col>
      </ReadOnlyButtonWrapper>
    </ProfileLayout>
  );
}
