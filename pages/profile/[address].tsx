import { GetServerSideProps } from "next";

import PublicProfilePage from "components/pages/public-profile/public-profile.controller";

import { User } from "interfaces/api";
import { Payment } from "interfaces/payments";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { PaginatedData, SearchBountiesPaginated } from "types/api";

import { getPaymentsData } from "x-hooks/api/task";
import { useGetUserByAddress } from "x-hooks/api/user";

export interface PublicProfileProps {
  user: User;
  payments?: PaginatedData<Payment>;
  tasks?: SearchBountiesPaginated;
}

export default function PublicProfile(props: PublicProfileProps) {
  return <PublicProfilePage {...props} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const type = query?.type?.toString() || "won";
  const address = query?.address?.toString();
  const user = address ? await useGetUserByAddress(address) : null;
  const getDataFn = {
    won: () => getPaymentsData({ wallet: address, ...query })
      .then(({ data }) => ({ payments: data }))
      .catch(() => ({ payments: [] }))
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