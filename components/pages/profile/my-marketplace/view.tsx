import { Col } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import NotFound from "components/common/not-found/view";
import If from "components/If";
import MyNetworkSettings from "components/network/settings/controller";
import ProfileLayout from "components/profile/profile-layout";

import { Network } from "interfaces/network";

import { SearchBountiesPaginated } from "types/api";

interface MyMarketplacePageViewProps {
  isLoading?: boolean;
  myNetwork: Network;
  bounties: SearchBountiesPaginated;
  updateEditingNetwork: () => Promise<void>;
}

export default function MyMarketplacePageView({
  isLoading,
  myNetwork,
  bounties,
  updateEditingNetwork,
}: MyMarketplacePageViewProps) {
  const { t } = useTranslation(["common", "custom-network"]);
  const isNotFound = !myNetwork && !isLoading;

  return (
    <ProfileLayout>
      <If condition={isLoading}>
        <div className="d-flex py-5 justify-content-center">
          <div className="spinner-border spinner-border-md ml-1" />
        </div>
      </If>
      <If
        condition={isNotFound}
        otherwise={
          <Col xs={12}>
            <MyNetworkSettings
              bounties={bounties}
              network={myNetwork}
              updateEditingNetwork={updateEditingNetwork}
            />
          </Col>
        }
      >
        <NotFound
          message={t("custom-network:errors.you-dont-have-a-custom-network")}
          action={t("actions.create-one")}
          href="/new-marketplace"
        />
      </If>
    </ProfileLayout>
  );
}
