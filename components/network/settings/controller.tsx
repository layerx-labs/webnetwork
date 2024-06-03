import { ReactNode, useEffect, useState } from "react";

import { useTranslation } from "next-i18next";

import { Divider } from "components/divider";
import NetworkGovernanceSettings from "components/network/settings/governance/controller";
import NetworkLogoAndColorsSettings from "components/network/settings/logo-and-colors/controller";
import NetworkManagement from "components/network/settings/management/view";
import AllowList from "components/network/settings/permissions/allow-list/allow-list.controller";
import BannedWords from "components/network/settings/permissions/banned-words/banned-words.controller";
import NetworkRegistrySettings from "components/network/settings/registry/controller";
import MyNetworkSettingsView from "components/network/settings/view";

import { useNetworkSettings } from "contexts/network-settings";

import { AllowListTypes } from "interfaces/enums/marketplace";
import { Network } from "interfaces/network";

import { SearchBountiesPaginated } from "types/api";

import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useNetworkTheme from "x-hooks/use-network-theme";

interface MyNetworkSettingsProps {
  network: Network;
  bounties: SearchBountiesPaginated;
}

export interface TabsProps {
  eventKey: string;
  title: string;
  component: ReactNode;
}

export default function MyNetworkSettings ({
  network,
  bounties,
}: MyNetworkSettingsProps) {
  const { t } = useTranslation(["common", "custom-network", "bounty"]);

  const [tabs, setTabs] = useState<TabsProps[]>([]);
  const [activeTab, setActiveTab] = useState("logo-and-colours");

  const marketplace = useMarketplace();
  const { currentUser } = useUserStore();
  const { colorsToCSS } = useNetworkTheme();
  const { settings } = useNetworkSettings();

  const isGovernorRegistry = currentUser?.isAdmin;

  const isCurrentNetwork =
    !!network &&
    !!marketplace?.active &&
    network?.networkAddress === marketplace?.active?.networkAddress;

  const networkNeedRegistration = network?.isRegistered === false;

  async function updateNetworkData () {
    if (isCurrentNetwork) await marketplace.refresh();
  }

  function getTabs (_tabs) {
    return _tabs.map(tab => ({
      label: tab?.title,
      active: tab?.eventKey === activeTab,
      onClick: () => setActiveTab(tab?.eventKey)
    }))
  }

  useEffect(() => {
    if (!network) return;

    setTabs([
      {
        eventKey: "logo-and-colours",
        title: t("custom-network:tabs.logo-and-colours"),
        component: (
          <NetworkLogoAndColorsSettings
            network={network}
          />
        ),
      },
      {
        eventKey: "governance",
        title: t("custom-network:tabs.governance"),
        component: (
          <NetworkGovernanceSettings
            network={network}
            updateEditingNetwork={() => {}}
          />
        ),
      },
      {
        eventKey: "registry",
        title: t("custom-network:tabs.registry"),
        component: (
          <NetworkRegistrySettings isGovernorRegistry={isGovernorRegistry}/>
        ),
      },
      {
        eventKey: "management",
        title: t("bounty:management.label"),
        component: (
          <NetworkManagement bounties={bounties}/>
        )
      },
      {
        eventKey: "permissions",
        title: t("custom-network:steps.permissions.title"),
        component: (
          <>
            <BannedWords network={network}/>
            <AllowList networkId={network.id} networkAddress={network.networkAddress} type={AllowListTypes.OPEN_TASK}/>
            <Divider bg="gray-800"/>
            <AllowList
              networkId={network.id}
              networkAddress={network.networkAddress}
              type={AllowListTypes.CLOSE_TASK}
            />
          </>
        )
      }
    ])
  }, [
    network,
    bounties,
    isGovernorRegistry,
    networkNeedRegistration,
  ]);

  return (
    <MyNetworkSettingsView
      themePreview={isCurrentNetwork ? colorsToCSS(settings?.theme?.colors) : ""}
      isNetworkUnregistered={networkNeedRegistration}
      isWalletConnected={!!currentUser?.walletAddress}
      updateNetworkData={updateNetworkData}
      networkAddress={network?.networkAddress}
      tabs={getTabs(tabs)}
      tabsProps={tabs}
      activeTab={activeTab}
    />
  );
}
