import { useEffect } from "react";

import { useRouter } from "next/router";

import MyMarketplacePage from "components/pages/profile/my-marketplace/controller";
import PaymentsPage from "components/pages/profile/payments/controller";
import DeliverablesPage from "components/profile/pages/deliverables";
import ProfilePage from "components/profile/pages/profile-page/controller";
import ProposalsPage from "components/profile/pages/proposals";
import TasksPage from "components/profile/pages/tasks";
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
    Route("/profile/tasks", TasksPage),
    Route("/profile/deliverables", DeliverablesPage),
    Route("/profile/proposals", ProposalsPage),
    Route("/profile/my-marketplace", MyMarketplacePage),
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