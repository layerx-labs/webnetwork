import { dehydrate } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";

import ProposalPage from "components/pages/task/proposal/controller";

import { QueryKeys } from "helpers/query-keys";

import { getReactQueryClient } from "services/react-query";

import { getCommentsData } from "x-hooks/api/comments";
import { getProposalData } from "x-hooks/api/proposal";

export default ProposalPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const queryClient = getReactQueryClient();
  const proposalId = query.proposalId?.toString();

  await queryClient.prefetchQuery(QueryKeys.proposal(proposalId), () => getProposalData(query));
  await queryClient.prefetchQuery(QueryKeys.proposalComments(proposalId), () => getCommentsData({ proposalId }));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "proposal",
        "deliverable",
        "connect-wallet-button",
      ])),
    },
  };
};
