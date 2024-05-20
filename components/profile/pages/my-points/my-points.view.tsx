import {CSSProperties} from "react";

import {useTranslation} from "next-i18next";

import Badge from "components/badge";
import CustomContainer from "components/custom-container";
import InfoTooltip from "components/info-tooltip";
import ScrollableTabs from "components/navigation/scrollable-tabs/view";
import { CollectedPoints } from "components/points-system/collected-points/collected-points.controller";
import DashboardLayout from "components/profile/dashboard-layout";
import ResponsiveWrapper from "components/responsive-wrapper";

import { formatNumberToString } from "helpers/formatNumber";

import {MiniTabsItem} from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

import {PointEventAction} from "../../../../types/point-event-action";
import {MyPointsHistory} from "./history/my-points-history.controller";


type MyPointsPageView = {
  tabs: MiniTabsItem[],
  activeTab: "collected-points" | "history",
  userTotalPoints: number,
  history: {actionName: PointEventAction, pointsWon: number, pointsCounted: boolean, info: any}[]
}

export function MyPointsPageView({
  tabs,
  activeTab,
  userTotalPoints,
  history
}) {
  const { t } = useTranslation("profile");

  const { currentBreakPoint } = useBreakPoint();

  const tabsComponents = {
    "history": <MyPointsHistory history={history} />,
    "collected-points": <CollectedPoints />,
  };

  const imageHeight = {
    xs: 170,
    sm: 170,
  }[currentBreakPoint] || 183;
  const imagePosition: CSSProperties = {
    position: "absolute",
    top: -imageHeight * 0.35,
    right: -imageHeight * 0.1,
  };

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
          <div className="col col-sm-8 col-md-6 col-lg-5 col-xl-4">
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

                    <span className="normal-3xl-medium text-white">{formatNumberToString(userTotalPoints, 0)}</span>
                  </div>
                </div>

                <div className="col position-relative px-0">
                  <div style={imagePosition}>
                    <img 
                      src="/images/trophy.png" 
                      alt="Trophies" 
                      height={imageHeight}
                      className=""
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