import { GetServerSideProps } from "next";

import PublicProfilePage from "components/pages/public-profile/public-profile.controller";

import { emptyPaginatedData } from "helpers/api";
import { isAddress } from "helpers/is-address";

import { User } from "interfaces/api";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import {
  DeliverablePaginatedData,
  PaymentPaginatedData,
  ProposalPaginatedData,
  SearchBountiesPaginated
} from "types/api";

import { useSearchDeliverables } from "x-hooks/api/deliverable/use-search-deliverables";
import { useSearchPayments } from "x-hooks/api/payment/use-search-payments";
import { useSearchProposals } from "x-hooks/api/proposal/use-search-proposals";
import { getBountiesListData } from "x-hooks/api/task";
import { useGetUserByAddress, useGetUserByLogin } from "x-hooks/api/user";

export interface PublicProfileProps {
  user: User;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
  payments?: PaymentPaginatedData;
}

export default function PublicProfile(props: PublicProfileProps) {
  return <PublicProfilePage {...props} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const type = query?.type?.toString() || "won";
  const identifier = query?.identifier?.toString();

  const redirect404 = {
    redirect: {
      destination: `/404`,
      permanent: false,
    },
  };

  if (!identifier)
    return redirect404;

  const finderMethod = isAddress(identifier) ? useGetUserByAddress : useGetUserByLogin;

  const user = await finderMethod(identifier);
  if (!user)
    return redirect404;

  const pageData = {
    tasks: emptyPaginatedData,
    deliverables: emptyPaginatedData,
    proposals: emptyPaginatedData,
    payments: emptyPaginatedData,
  };

  const getTasks = async (filter: "receiver" | "creator") => getBountiesListData({
    [filter]: user.address,
    ...query
  })
    .then(({ data }) => data)
    .catch(() => emptyPaginatedData as SearchBountiesPaginated);

  switch (type) {
  case "won":
    pageData.tasks = await getTasks("receiver");
    break;
  case "opened":
    pageData.tasks = await getTasks("creator");
    break;
  case "submissions":
    pageData.deliverables = await useSearchDeliverables({ creator: user.address, ...query });
    break;
  case "proposals":
    pageData.proposals = await useSearchProposals({ creator: user.address, ...query });
    break;
  case "nfts":
    pageData.payments = await useSearchPayments({ wallet: user.address, ...query });
  }

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