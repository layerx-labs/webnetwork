import { dehydrate } from "@tanstack/react-query";
import { getToken } from "next-auth/jwt";
import getConfig from "next/config";
import { GetServerSideProps } from "next/types";

import ProposalPage from "components/pages/task/proposal/controller";

import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";

import { getReactQueryClient } from "services/react-query";

import customServerSideTranslations from "server/utils/custom-server-side-translations";

import { getCommentsData } from "x-hooks/api/comments";
import { getProposalData } from "x-hooks/api/proposal";

const { serverRuntimeConfig: { auth: { secret } } } = getConfig();

export default ProposalPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
  locale,
}) => {
  const token = await getToken({ req, secret: secret });
  const queryClient = getReactQueryClient();
  const proposalId = query.proposalId?.toString();
  const proposalData = await getProposalData(query);

  if (proposalData?.issue?.privateDeliverables) {
    const currentUser = token?.address as string;
    const isTaskCreator = lowerCaseCompare(currentUser, proposalData?.issue?.user?.address);

    if (!currentUser || !isTaskCreator)
      return {
        redirect: {
          permanent: false,
          destination: `/${proposalData?.network?.name}/task/${proposalData?.issue?.id}`,
        },
        props: {},
      };
  }

  await queryClient.setQueryData(QueryKeys.proposal(proposalId), proposalData);
  await queryClient.prefetchQuery({
    queryKey: QueryKeys.proposalComments(proposalId),
    queryFn: () => getCommentsData({ proposalId }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await customServerSideTranslations(req, locale, [
        "common",
        "bounty",
        "proposal",
        "deliverable",
        "connect-wallet-button",
      ])),
    },
  };
};
