import { useTranslation } from "next-i18next";

import Badge from "components/badge";
import CustomContainer from "components/custom-container";
import InfoTooltip from "components/info-tooltip";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";
import DashboardLayout from "components/profile/dashboard-layout";
import ResponsiveWrapper from "components/responsive-wrapper";

import { MiniTabsItem } from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";


type MyPointsPageView = {
  tabs: MiniTabsItem[],
  activeTab: "collected-points" | "history",
  userTotalPoints: number,
}

export function MyPointsPageView({
  tabs,
  activeTab,
  userTotalPoints
}) {
  const { t } = useTranslation("profile");

  const { currentBreakPoint } = useBreakPoint();

  const tabsComponents = {
    "collected-points": <h1>Collected Points tab</h1>,
    "history": <h1>History tab</h1>,
  };

  const imageHeight = {
    xs: 150,
    sm: 170,
  }[currentBreakPoint] || 183;

  return(
    <div>
      <div className="border-bottom border-gray-850 border-xl-0">
        <CustomContainer>
          <ResponsiveWrapper xl={false} xs={true} className="mb-4">
            <h4>{t("my-points")}</h4>
          </ResponsiveWrapper>
        </CustomContainer>
      </div>

      <DashboardLayout>
        <div className="row mb-5">
          <div className="col col-sm-8 col-md-6 col-lg-5 col-xl-3">
            <Badge
              color="yellow-850"
              className="p-4 border border-yellow-500 border-radius-8 w-100 position-relative"
            >
              <div className="row">
                <div className="col">
                  <div className="d-flex flex-column align-items-start">
                    <div className="d-flex align-items-center gap-1">
                      <span className="base-medium font-weight-normal text-white">
                        {t("your-points")}
                      </span>

                      <InfoTooltip 
                        description={t("total-points-earned")}
                        iconColor="white"
                        secondaryIcon 
                      />
                    </div>

                    <span className="normal-3xl-medium text-white">{userTotalPoints}</span>
                  </div>
                </div>

                <div className="col position-relative px-0">
                  <div className="position-absolute mt-n5 ml-md-3 ml-xl-5">
                    <img 
                      src="/images/trophy.png" 
                      alt="Trophies" 
                      height={imageHeight}
                      className="mt-md-n2"
                    />
                  </div>
                </div>
              </div>
            </Badge>
          </div>
        </div>

        <ScrollableTabs
          tabs={tabs}
        />
        {tabsComponents[activeTab]}
      </DashboardLayout>
    </div>
  );
}