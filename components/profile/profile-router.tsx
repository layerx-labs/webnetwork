import { useEffect } from "react";

import { useRouter } from "next/router";

import MyNetworkPage from "components/pages/profile/my-network/controller";
import PaymentsPage from "components/pages/profile/payments/controller";
import BountiesPage from "components/profile/pages/bounties";
import DeliverablesPage from "components/profile/pages/deliverables";
import ProfilePage from "components/profile/pages/profile-page/controller";
import ProposalsPage from "components/profile/pages/proposals";
import VotingPowerPage from "components/profile/pages/voting-power/controller";
import WalletPage from "components/profile/pages/wallet/view";

import { ProfilePageProps } from "types/pages";

export default function ProfileRouter(props: ProfilePageProps) {
  const { asPath, push } = useRouter();

  const Route = (path, page) => ({ path, page });

  const routes = [
    Route("/profile", ProfilePage),
    Route("/profile/wallet", WalletPage),
    Route("/profile/voting-power", VotingPowerPage),
    Route("/profile/payments", PaymentsPage),
    Route("/profile/bounties", BountiesPage),
    Route("/profile/deliverables", DeliverablesPage),
    Route("/profile/proposals", ProposalsPage),
    Route("/profile/my-network", MyNetworkPage),
  ];

  const currentRoute = routes.find(({ path }) => asPath.split("?")[0].endsWith(path));

  useEffect(() => {
    if (!currentRoute)
      push("/404");
  }, [currentRoute]);

  if (currentRoute)
    return <currentRoute.page {...props} />;

  return <></>;
}