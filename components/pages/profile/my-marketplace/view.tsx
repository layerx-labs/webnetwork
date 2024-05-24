import { Col, Row } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import NotFound from "components/common/not-found/view";
import If from "components/If";
import ChainFilter from "components/lists/filters/chain/controller";
import MarketplaceFilter from "components/lists/filters/marketplace/controller";
import MyNetworkSettings from "components/network/settings/controller";
import DashboardLayout from "components/profile/dashboard-layout";

import { Network } from "interfaces/network";
import { SupportedChainData } from "interfaces/supported-chain-data";

import { SearchBountiesPaginated } from "types/api";

interface MyMarketplacePageViewProps {
  currentMarketplace: Network;
  selectedNetwork: Network;
  selectedChain: SupportedChainData;
  chains: SupportedChainData[];
  networks: Network[];
  bounties: SearchBountiesPaginated;
  onChainSelected: (chain: string | number) => void;
  onNetworkSelected: (network: string | number) => void;
}

export default function MyMarketplacePageView({
  currentMarketplace,
  selectedChain,
  chains,
  networks,
  bounties,
  onChainSelected,
  onNetworkSelected,
}: MyMarketplacePageViewProps) {
  const { t } = useTranslation(["common", "custom-network"]);

  const isNotFound = !chains?.length && !networks?.length;

  return (
    <DashboardLayout>
      <If
        condition={isNotFound}
        otherwise={
          <Col xs={12}>
            <Row className="mb-3">
              <Col>
                <h3 className="text-white font-weight-500">
                  {t("custom-network:title")}
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

            <If 
              condition={!!currentMarketplace}
              otherwise={
                <div className="bg-gray-900 border-radius-4 px-3 py-5 text-center mb-4">
                  <span className="base-medium text-white font-weight-normal">
                  {t("custom-network:select-marketplace-and-network")}
                  </span>
                </div>
              }
            >
              <MyNetworkSettings
                bounties={bounties}
                network={currentMarketplace}
              />
            </If>
          </Col>
        }
      >
        <NotFound
          message={t("custom-network:errors.you-dont-have-a-custom-network")}
          action={t("actions.create-one")}
          href="/new-marketplace"
        />
      </If>
    </DashboardLayout>
  );
}
