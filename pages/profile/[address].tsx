import { GetServerSideProps } from "next";

import PublicProfilePage from "components/pages/public-profile/public-profile.controller";

import { emptyPaginatedData } from "helpers/api";

import { User } from "interfaces/api";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { SearchBountiesPaginated } from "types/api";

import { getBountiesListData } from "x-hooks/api/task";
import { useGetUserByAddress } from "x-hooks/api/user";

export interface PublicProfileProps {
  user: User;
  tasks: SearchBountiesPaginated;
}

export default function PublicProfile(props: PublicProfileProps) {
  return <PublicProfilePage {...props} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const type = query?.type?.toString() || "won";
  const address = query?.address?.toString();
  const user = address ? await useGetUserByAddress(address) : null;
  const getDataFn = {
    won: () => getBountiesListData({
      receiver: address,
      ...query,
    })
      .then(({ data }) => ({ tasks: data }))
      .catch(() => emptyPaginatedData as SearchBountiesPaginated)
  };
  const pageData = address ? await getDataFn[type]?.() : {};

  return {
    props: {
      user,
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