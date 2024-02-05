import { GetServerSideProps } from "next";

import PublicProfilePage from "components/pages/public-profile/public-profile.controller";

import { emptyPaginatedData } from "helpers/api";

import { User } from "interfaces/api";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { DeliverablePaginatedData, ProposalPaginatedData, SearchBountiesPaginated } from "types/api";

import { useSearchDeliverables } from "x-hooks/api/deliverable/use-search-deliverables";
import { useSearchProposals } from "x-hooks/api/proposal/use-search-proposals";
import { getBountiesListData } from "x-hooks/api/task";
import { useGetUserByAddress } from "x-hooks/api/user";

export interface PublicProfileProps {
  user: User;
  tasks?: SearchBountiesPaginated;
  deliverables?: DeliverablePaginatedData;
  proposals?: ProposalPaginatedData;
}

export default function PublicProfile(props: PublicProfileProps) {
  return <PublicProfilePage {...props} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const type = query?.type?.toString() || "won";
  const address = query?.address?.toString();
  const user = address ? await useGetUserByAddress(address) : null;
  const pageData = {
    tasks: emptyPaginatedData,
    deliverables: emptyPaginatedData,
    proposals: emptyPaginatedData,
  };

  const getTasks = async (filter: "receiver" | "creator") => getBountiesListData({
    [filter]: address,
    ...query,
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
    pageData.deliverables = await useSearchDeliverables({ creator: address, ...query });
    break;
  case "proposals":
    pageData.proposals = await useSearchProposals({ creator: address, ...query });
    break;
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