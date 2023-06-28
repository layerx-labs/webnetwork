import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";

import ProposalPage from "components/pages/bounty/proposal/controller";

import { getPullRequestsDetails } from "x-hooks/api/bounty/get-bounty-data";
import getProposalData from "x-hooks/api/get-proposal-data";

export default ProposalPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
}) => {
  const proposal = await getProposalData({
    ...query,
    issueId: `${query?.repoId}/${query?.id}`,
  })
    .then(({ data }) => data)
    .catch(() => undefined);

  const pullRequestDetails = await getPullRequestsDetails(proposal?.issue?.repository?.githubPath,
                                                          [proposal?.pullRequest])
    .then((data) => [...data].shift())
    .catch(() => undefined);

  return {
    props: {
      proposal: {
        ...proposal,
        pullRequest: {
          ...proposal?.pullRequest,
          ...pullRequestDetails,
        },
      },
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "proposal",
        "pull-request",
        "connect-wallet-button",
      ])),
    },
  };
};
