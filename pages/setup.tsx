import {useEffect, useState} from "react";
import {Container, Row} from "react-bootstrap";

import {GetServerSideProps} from "next";
import { getToken } from "next-auth/jwt";
import {useTranslation} from "next-i18next";
import getConfig from "next/config";
import {useRouter} from "next/router";

import { PointsSystemAdministration } 
  from "components/administration/points-system-administration/points-system-administration.controller";
import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import {CallToAction} from "components/setup/call-to-action";
import ChainsSetup from "components/setup/chains-setup";
import {NetworkSetup} from "components/setup/network-setup";
import {RegistrySetup} from "components/setup/registry-setup";
import TabbedNavigation from "components/tabbed-navigation";

import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { useSearchNetworks } from "x-hooks/api/marketplace";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQuery from "x-hooks/use-react-query";
import useSupportedChain from "x-hooks/use-supported-chain";

const { publicRuntimeConfig, serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default function SetupPage(){
  const { replace } = useRouter();
  const { t } = useTranslation(["setup", "common", "administration"]);

  const [activeTab, setActiveTab] = useState("supportedChains");

  const { currentUser } = useUserStore();
  const { supportedChains, connectedChain } = useSupportedChain();

  const isConnected = !!currentUser?.walletAddress;
  const isAdmin = !!currentUser?.isAdmin;

  function searchForNetwork() {
    return useSearchNetworks({
      isDefault: true
    })
      .then(({ rows, count }) => {
        if (count > 0)
          return rows[0];
        return null;
      });
  }

  const { data: defaultNetwork } = useReactQuery( QueryKeys.networkDefault(),
                                                  searchForNetwork,
                                                  {
                                                    enabled: isConnected && isAdmin
                                                  });

  useEffect(() => {
    if (isConnected && !isAdmin)
      replace("/marketplaces");
  }, [currentUser?.isAdmin, currentUser?.walletAddress]);

  if (!currentUser?.walletAddress)
    return <ConnectWalletButton asModal />;

  const tabs = [
    {
      eventKey: 'supportedChains',
      title: t('setup:chains.title'),
      component: <ChainsSetup />
    },
    {
      eventKey: "registry",
      title: t("setup:registry.title"),
      component: (
        !supportedChains?.length
          ? <CallToAction 
              disabled={false} 
              executing={false} 
              call="missing supported chains configuration step" 
              action="go to" 
              color="info" 
              onClick={() => setActiveTab('supportedChains')} 
            />
          : <RegistrySetup 
              registryAddress={connectedChain?.registry}
              isVisible={activeTab === "registry"}
            />
      )
    },
    {
      eventKey: "network",
      title: t("setup:network.title"),
      component: (
        !supportedChains?.length
          ? <CallToAction 
              disabled={false} 
              executing={false} 
              call="missing supported chains configuration step" 
              action="go to" 
              color="info" 
              onClick={() => setActiveTab('supportedChains')} 
            /> :
          !connectedChain?.registry
            ? <CallToAction 
                disabled={false} 
                executing={false} 
                action="go to" 
                color="info" 
                call="Registry not setup" 
                onClick={() => setActiveTab('registry')} 
              />
            : <NetworkSetup 
                isVisible={activeTab === "network"}
                defaultNetwork={defaultNetwork}
              />
      )
    },
    {
      eventKey: "points-system",
      title: t("administration:points-system.title"),
      component: <PointsSystemAdministration />
    }
  ];

  return(
    <Container>
      <Row className="text-center">
        <h1>{t("title")}</h1>
      </Row>

      {(isConnected && isAdmin) &&
        <Row className="mt-2">
          <TabbedNavigation
            tabs={tabs}
            forceActiveKey={activeTab}
            className="issue-tabs"
            defaultActiveKey="supportedChains"
            onTransition={setActiveTab}
          />
        </Row>
      }

    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const token = await getToken({ req, secret: secret });

  if (!token?.address || !lowerCaseCompare(token?.address?.toString(), publicRuntimeConfig?.adminWallet))
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
      props: {},
    };

  return {
    props: {
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "custom-network",
        "connect-wallet-button",
        "change-token-modal",
        "setup",
        "profile",
        "administration"
      ])),
    },
  };
};
