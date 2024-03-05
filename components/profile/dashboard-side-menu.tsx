import DashboardLinks from "components/profile/dashboard-links";
import ResponsiveWrapper from "components/responsive-wrapper";

export default function DashboardSideMenu() {
  return (
    <ResponsiveWrapper
      xl={true}
      xs={false}
      className="col-2 bg-gray-950"
    >
      <div className="ml-2 pt-4 w-100">
        <DashboardLinks />
      </div>
    </ResponsiveWrapper>
  );
}
