import React, {useEffect, useState} from "react";

import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {GetServerSideProps} from "next/types";

import BountyBodyController from "components/bounty/body/controller";
import BountyHeroController from "components/bounty/bounty-hero/controller";
import BountyCommentsController from "components/bounty/comments/controller";
import FundingSectionController from "components/bounty/funding-section/controller";
import PageActionsController from "components/bounty/page-actions/controller";
import TabSections from "components/bounty/tabs-sections";
import If from "components/If";

import {useAppState} from "contexts/app-state";
import {BountyEffectsProvider} from "contexts/bounty-effects";

import {IM_AM_CREATOR_ISSUE} from "helpers/constants";

import { IssueData } from "interfaces/issue-data";

import { api } from "services/api";

import {useAuthentication} from "x-hooks/use-authentication";
import useOctokit from "x-hooks/use-octokit";


export default function PageIssue() {
  // useBounty();
  const router = useRouter();

  const [commentsIssue, setCommentsIssue] = useState([]);
  const [isRepoForked, setIsRepoForked] = useState<boolean>();
  const [isEditIssue, setIsEditIssue] = useState<boolean>(false);

  const {state} = useAppState();
  const { getUserRepository } = useOctokit();
  const { signMessage } = useAuthentication();

  const { id } = router.query;

  async function handleEditIssue() {
    signMessage(IM_AM_CREATOR_ISSUE)
      .then(() => {
        setIsEditIssue(true);
      })
      .catch(error => console.debug(error));
  }

  function handleCancelEditIssue() {
    setIsEditIssue(false)
  }

  function checkForks(){
    if (!state.Service?.network?.repos?.active?.githubPath || isRepoForked !== undefined) return;

    if (state.currentBounty?.data?.working?.includes(state.currentUser?.login))
      return setIsRepoForked(true);

    const [, activeName] = state.Service.network.repos.active.githubPath.split("/");
  
    getUserRepository(state.currentUser?.login, activeName)
    .then(repository => {
      const { isFork, nameWithOwner, parent } = repository;

      setIsRepoForked(isFork && parent?.nameWithOwner === state.Service.network.repos.active.githubPath ||
        nameWithOwner.startsWith(`${state.currentUser?.login}/`));
    })
    .catch((e) => {
      setIsRepoForked(false);
      console.log("Failed to get users repositories: ", e);
    });
  }

  function addNewComment(comment) {
    setCommentsIssue([...commentsIssue, comment]);
  }

  useEffect(() => {
    if (state.currentBounty?.comments) setCommentsIssue([...state.currentBounty?.comments || []]);
  }, [ state.currentBounty?.data, state.Service?.network?.repos?.active ]);

  useEffect(() => {
    if (!state.currentUser?.login ||
        !state.currentUser?.walletAddress ||
        !state.Service?.network?.repos?.active ||
        !state.currentBounty?.data ||
        isRepoForked !== undefined) 
      return;
    checkForks();
  },[
    state.currentUser?.login, 
    state.currentBounty?.data?.working, 
    state.Service?.network?.repos?.active,
    !state.currentUser?.walletAddress
  ]);

  return (
    <BountyEffectsProvider>
      <BountyHeroController 
        handleEditIssue={handleEditIssue}
        isEditIssue={isEditIssue}
      />

      <If condition={!!state.currentBounty?.data?.isFundingRequest}>
        <FundingSectionController /> 
      </If>

      <PageActionsController
        isRepoForked={!!isRepoForked}
        addNewComment={addNewComment}
        handleEditIssue={handleEditIssue}
        isEditIssue={isEditIssue}
      />

      <If condition={!!state.currentUser?.walletAddress}>
        <TabSections/>
      </If>

      <BountyBodyController 
        isEditIssue={isEditIssue} 
        cancelEditIssue={handleCancelEditIssue}
        />

      <BountyCommentsController
        comments={commentsIssue}
        repo={state.currentBounty?.data?.repository?.githubPath}
        issueId={id}
      />
    </BountyEffectsProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const { id, repoId, network, chain } = query;
  
  const currentIssue = await api
    .get<IssueData>(`/issue/seo/${repoId}/${id}/${network}/${chain}`)
    .then(({ data }) => data)
    .catch(() => null);

  return {
    props: {
      currentIssue,
      ...(await serverSideTranslations(locale, [
        "common",
        "bounty",
        "proposal",
        "pull-request",
        "connect-wallet-button",
        "funding"
      ]))
    }
  };
};
