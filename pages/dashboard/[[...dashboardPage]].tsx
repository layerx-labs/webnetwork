import {GetServerSideProps} from "next";
import {getToken} from "next-auth/jwt";
import getConfig from "next/config";

import DashboardRouter from "components/profile/dashboard-router";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import {DashboardPageProps} from "types/pages";

import {useGetChains} from "x-hooks/api/chain";
import {useGetProfileBounties, useGetProfilePayments} from "x-hooks/api/pages/profile";
import {useGetTokens} from "x-hooks/api/token";

import {useGetPointsHistory} from "../../x-hooks/api/pages/profile/use-get-points-history";

const { serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default function Dashboard(props: DashboardPageProps) {
  return <DashboardRouter {...props} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const token = await getToken({ req, secret: secret });
  const { dashboardPage } = query || {};
  const [pageName] = (dashboardPage || ["dashboard"]);
  const queryWithWallet = {
    ...query,
    wallet: token?.address as string
  };
  const chainWalletFilter = {
    type: "transactional",
    ... query?.networkChain ? { chainShortName: query.networkChain.toString() } : {}
  };

  const bountiesResult = result => ({ bounties: result });

  const getDataFn = {
    payments: () => useGetProfilePayments(queryWithWallet),
    wallet: () => Promise.all([
      useGetTokens(chainWalletFilter).catch(() => []),
      useGetChains().catch(() => [])
    ])
      .then(([tokens, chains]) => ({ tokens, chains })),
    tasks: () => useGetProfileBounties(queryWithWallet, "creator").then(bountiesResult),
    proposals: () => useGetProfileBounties(queryWithWallet, "proposer").then(bountiesResult),
    "deliverables": () => useGetProfileBounties(queryWithWallet, "deliverabler").then(bountiesResult),
    "my-marketplace": () => useGetProfileBounties(query, "governor").then(bountiesResult),
    "my-points": async () => ({
      history: await useGetPointsHistory(token?.address as string),
    }),
  };

  const pageData = getDataFn[pageName] ? await getDataFn[pageName]() : {};

  return {
    props: {
      ...pageData,
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "my-oracles",
        "connect-wallet-button",
        "profile",
        "deliverable",
        "custom-network",
        "setup",
        "change-token-modal",
        "proposal"
      ]))
    }
  };
};
