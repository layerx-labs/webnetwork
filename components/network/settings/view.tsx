import { Col, Row } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import If from "components/If";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";
import { TabsProps } from "components/network/settings/controller";
import RegisterNetworkWarning from "components/network/settings/register-network-warning/controller";

import { MiniTabsItem } from "types/components";

interface MyNetworkSettingsViewProps {
  themePreview: string;
  tabs: MiniTabsItem[];
  tabsProps: TabsProps[];
  activeTab: string;
  isWalletConnected?: boolean;
  networkAddress: string;
  isNetworkUnregistered?: boolean;
  updateNetworkData: () => Promise<void>;
}

export default function MyNetworkSettingsView({
  themePreview,
  tabs,
  tabsProps,
  activeTab,
  isWalletConnected,
  networkAddress,
  isNetworkUnregistered,
  updateNetworkData,
}: MyNetworkSettingsViewProps) {
  const { t } = useTranslation(["common", "custom-network", "bounty"]);

  return (
    <>
      <style>{themePreview}</style>

      <If condition={isNetworkUnregistered}>
        <RegisterNetworkWarning
          isConnected={isWalletConnected}
          networkAddress={networkAddress}
          updateNetworkData={updateNetworkData}
        />
      </If>

      <ScrollableTabs
        tabs={tabs}
      />

      {tabsProps.find(({ eventKey }) => activeTab === eventKey)?.component}
    </>
  );
}