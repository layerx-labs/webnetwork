import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ProfileRouter from "components/profile/profile-router";

import { ProfilePageProps } from "types/pages";

import { useGetProfileBounties, useGetProfilePayments } from "x-hooks/api/pages/profile";

export default function Profile(props: ProfilePageProps) {
  return <ProfileRouter {...props} />;
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { profilePage } = query || {};
  const [pageName] = (profilePage || ["profile"]);

  const getDataFn = {
    payments: () => useGetProfilePayments(query),
    bounties: () => useGetProfileBounties(query, "creator"),
    proposals: () => useGetProfileBounties(query, "proposer"),
    "pull-requests": () => useGetProfileBounties(query, "pullRequester"),
    "my-network": () => useGetProfileBounties(query, "governor"),
  };

  const pageData = await getDataFn[pageName]();
  
  return {
    props: {
      ...pageData,
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "my-oracles",
        "connect-wallet-button",
        "profile",
        "pull-request",
        "custom-network",
        "setup",
        "change-token-modal",
        "proposal"
      ]))
    }
  };
};
