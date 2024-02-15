import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";
import DashboardSideMenu from "components/profile/dashboard-side-menu";

export default function DashboardLayout({ children, childrenClassName = "" }) {
  return (
    <>
      <ConnectWalletButton asModal={true} />

      <div className="row mx-0 h-100">
        <DashboardSideMenu />

        <div
          className={`col-12 col-xl-10 p-3 p-xl-5 profile-content bg-gray-950 ${childrenClassName}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
