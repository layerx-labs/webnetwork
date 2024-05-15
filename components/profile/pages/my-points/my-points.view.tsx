import ScrollableTabs from "components/navigation/scrollable-tabs/view";
import DashboardLayout from "components/profile/dashboard-layout";

import { MiniTabsItem } from "types/components";

type MyPointsPageView = {
  tabs: MiniTabsItem[]
  activeTab: "collected-points" | "history"
}

export function MyPointsPageView({
  tabs,
  activeTab
}) {
  const tabsComponents = {
    "collected-points": <h1>Collected Points tab</h1>,
    "history": <h1>History tab</h1>,
  };

  return(
    <div>
      <DashboardLayout>
        <ScrollableTabs
          tabs={tabs}
        />
        {tabsComponents[activeTab]}
      </DashboardLayout>
    </div>
  );
}