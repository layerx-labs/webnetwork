import DashboardLinks from "components/profile/dashboard-links";
import {ResponsiveEle} from "components/responsive-wrapper";

export default function DashboardSideMenu() {
  return (
    <ResponsiveEle mobileView={null}
                   desktopView={<div className="ml-2 pt-4 w-100"><DashboardLinks/></div>}
                   className="col-2 bg-gray-950" />
  );
}
