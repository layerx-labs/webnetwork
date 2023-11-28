import { ReactNode } from "react";
import {Col, Row} from "react-bootstrap";

import { useTranslation } from "next-i18next";

import SelectNetwork from "components/bounties/select-network";
import ChainSelector from "components/navigation/chain-selector/controller";
import ProfileLayout from "components/profile/profile-layout";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

import {Network} from "interfaces/network";

export default function VotingPowerPageView({
  children,
  handleMarketplaceChange
}: {
  children: ReactNode;
  handleMarketplaceChange: (network: Network) => void;
  isLoading?: boolean;
}) {
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
              <ChainSelector
                placeholder="Select a network"
                isFilter
              />
            </Col>

            <Col xs="12" md="auto">
              <SelectNetwork
                filterByConnectedChain
                hideLabel
                isClearable={false}
                onChange={handleMarketplaceChange}
              />
            </Col>
          </Row>

          {children}
        </Col>
      </ReadOnlyButtonWrapper>
    </ProfileLayout>
  );
}
