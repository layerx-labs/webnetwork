import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next/types";

import ProposalPage from "components/pages/bounty/proposal/controller";

import { getPullRequestsDetails } from "x-hooks/api/bounty/get-bounty-data";
import getProposalData from "x-hooks/api/get-proposal-data";
import useOctokit from "x-hooks/use-octokit";

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

  const [pullRequestDetails, repositoryDetails] = await Promise.all([
    getPullRequestsDetails( proposal?.issue?.repository?.githubPath,
                            [proposal?.pullRequest])
    .then((data) => [...data].shift())
    .catch(() => undefined),
    useOctokit().getRepository(proposal?.issue?.repository?.githubPath)
      .then(data => data)
      .catch(() => undefined)
  ]);

  return {
    props: {
      proposal: {
        ...proposal,
        issue: {
          ...proposal?.issue,
          repository: {
            ...proposal?.issue?.repository,
            ...repositoryDetails
          }
        },
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
