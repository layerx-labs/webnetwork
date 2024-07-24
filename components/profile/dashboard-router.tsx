import {useEffect} from "react";

import {useRouter} from "next/router";

import MyMarketplacePage from "components/pages/profile/my-marketplace/controller";
import PaymentsPage from "components/pages/profile/payments/controller";
import DeliverablesPage from "components/profile/pages/deliverables";
import DashboardPage from "components/profile/pages/profile-page/controller";
import ProposalsPage from "components/profile/pages/proposals";
import TasksPage from "components/profile/pages/tasks";
import VotingPowerPage from "components/profile/pages/voting-power/controller";
import WalletPage from "components/profile/pages/wallet/view";

import {DashboardPageProps} from "types/pages";

import SubscriptionsPage from "./pages/subscriptions";

export default function DashboardRouter(props: DashboardPageProps) {
  const { asPath, push } = useRouter();

  const Route = (path, page) => ({ path, page });

  const routes = [
    Route("/dashboard", DashboardPage),
    Route("/dashboard/wallet", WalletPage),
    Route("/dashboard/voting-power", VotingPowerPage),
    Route("/dashboard/payments", PaymentsPage),
    Route("/dashboard/tasks", TasksPage),
    Route("/dashboard/deliverables", DeliverablesPage),
    Route("/dashboard/proposals", ProposalsPage),
    Route("/dashboard/subscriptions", SubscriptionsPage),
    Route("/dashboard/my-marketplace", MyMarketplacePage),
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