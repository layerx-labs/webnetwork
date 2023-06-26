import { useTranslation } from "next-i18next";

import Avatar from "components/avatar";
import DateLabel from "components/date-label";
import GithubInfo from "components/github-info";
import PullRequestLabels from "components/pull-request/labels/controller";
import Translation from "components/translation";

import { useAppState } from "contexts/app-state";

import { pullRequest } from "interfaces/issue-data";

import { useNetwork } from "x-hooks/use-network";

import If from "./If";
import InternalLink from "./internal-link";

interface IProposalPRDetailsProps {
  currentPullRequest: pullRequest;
}
export default function ProposalPullRequestDetail({
  currentPullRequest,
}: IProposalPRDetailsProps) {
  const { t } = useTranslation("pull-request");

  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();

  return (
    <>
      <div className="row align-items-center">
        <div className="col-auto">
          <span className="caption-large text-capitalize text-white">
            {t("pull-request:label")}
          </span>
        </div>

        <div className="col-auto px-0">
          <InternalLink
            href={getURLWithNetwork("pull-request", {
              id: state.currentBounty?.data?.githubId,
              repoId: state.currentBounty?.data?.repository_id,
              prId: currentPullRequest?.githubId,
            })}
            title={t("actions.go-to-pull-request")}
            className="caption-large text-gray-500 p-0 hover-primary text-decoration-underline"
            label={`#${currentPullRequest?.githubId || ""}`}
            transparent
          />
        </div>

        <div className="col-auto">
          <PullRequestLabels
            merged={currentPullRequest?.merged}
            isMergeable={currentPullRequest?.isMergeable}
          />
        </div>
      </div>

      <div className="row align-items-center mt-2 gy-2">
        <div className="col-xs-12 col-xl-auto">
          <div className="row align-items-center">
            <div className="col-auto px-1">
              <Avatar
                className="me-2"
                userLogin={currentPullRequest?.githubLogin}
              />
            </div>

            <div className="col-auto px-0">
              <GithubInfo
                parent="hero"
                variant="user"
                label={["@", currentPullRequest?.githubLogin].join("")}
              />
            </div>
          </div>
        </div>

        <div className="col-xs-12 col-xl-auto">
          <If condition={!!state.currentBounty?.data?.repository}>
            <span className="caption-small">
              <GithubInfo
                parent="list"
                variant="repository"
                label={state.currentBounty?.data?.repository?.githubPath}
              />
            </span>
          </If>
        </div>

        <div className="col-xs-12 col-xl-auto">
          <span className="caption-small text-light-gray text-uppercase">
            <Translation label={"branch"} />:
            <span className="text-primary">
              {currentPullRequest?.userBranch}
            </span>
          </span>
        </div>

        <div className="col-xs-12 col-xl-auto">
          {currentPullRequest?.createdAt && (
            <DateLabel
              date={currentPullRequest?.createdAt}
              className="text-gray-500"
            />
          )}
        </div>
      </div>
    </>
  );
}
