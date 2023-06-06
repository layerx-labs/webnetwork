import React, {useEffect, useState} from "react";

import { SSRConfig } from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {GetServerSideProps} from "next/types";

import BountyBody from "components/bounty/body/controller";
import BountyHero from "components/bounty/bounty-hero/controller";
import BountyCommentsController from "components/bounty/comments/controller";
import FundingSection from "components/bounty/funding-section/controller";
import PageActions from "components/bounty/page-actions/controller";
import TabSections from "components/bounty/tabs-sections";
import If from "components/If";

import {useAppState} from "contexts/app-state";
import {BountyEffectsProvider} from "contexts/bounty-effects";

import {IM_AM_CREATOR_ISSUE} from "helpers/constants";
import { issueParser } from "helpers/issue";

import { CurrentBounty } from "interfaces/application-state";
import { IssueData } from "interfaces/issue-data";

import { api } from "services/api";

import { getBountyData, getBountyComments, getPullRequestsDetails } from "x-hooks/api/get-bounty-data";
import {useAuthentication} from "x-hooks/use-authentication";
import useOctokit from "x-hooks/use-octokit";

interface PageBountyProps {
  bounty: {
    comments: any[]; //eslint-disable-line
    data: IssueData;
}
  _nextI18Next?: SSRConfig;
}

export default function PageIssue({ bounty }: PageBountyProps) {
  // useBounty();
  const router = useRouter();
  const [currentBounty, setCurrentBounty] = useState<CurrentBounty>();
  const [commentsIssue, setCommentsIssue] = useState([]);
  const [isRepoForked, setIsRepoForked] = useState<boolean>();
  const [isEditIssue, setIsEditIssue] = useState<boolean>(false);

  const {state} = useAppState();
  const { getUserRepository } = useOctokit();
  const { signMessage } = useAuthentication();

  const { id } = router.query;

  useEffect(() => {
    if (!bounty) return;
    
    setCurrentBounty({
      data: issueParser(bounty?.data),
      comments: bounty?.comments,
      lastUpdated: 0,
    });
  }, [bounty]);

  async function updateBountyData(updatePrData = false) {
    const bountyDatabase = await getBountyData(router.query)

    if(updatePrData) {
      const pullRequests = await getPullRequestsDetails(bountyDatabase?.repository?.githubPath,
                                                        bountyDatabase?.pullRequests);
      setCurrentBounty({
        data: { ...issueParser(bountyDatabase), pullRequests},
        ...currentBounty
      })
    } else {
      setCurrentBounty({
        data: { ...issueParser(bountyDatabase), pullRequests: currentBounty?.data?.pullRequests },
        ...currentBounty
      })
    }
  }

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

    if (bounty?.data?.working?.includes(state.currentUser?.login))
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
    if (currentBounty?.comments) setCommentsIssue([...currentBounty?.comments || []]);
  }, [ currentBounty?.data, state.Service?.network?.repos?.active ]);

  useEffect(() => {
    if (!state.currentUser?.login ||
        !state.currentUser?.walletAddress ||
        !state.Service?.network?.repos?.active ||
        !currentBounty?.data ||
        isRepoForked !== undefined) 
      return;
    checkForks();
  },[
    state.currentUser?.login, 
    currentBounty?.data?.working, 
    state.Service?.network?.repos?.active,
    !state.currentUser?.walletAddress
  ]);

  return (
    <BountyEffectsProvider>
      <BountyHero 
        currentBounty={currentBounty?.data}
        handleEditIssue={handleEditIssue}
        isEditIssue={isEditIssue}
      />

      <If condition={!!currentBounty?.data?.isFundingRequest}>
        <FundingSection 
          currentBounty={currentBounty?.data}
          updateBountyData={updateBountyData}
        /> 
      </If>

      <PageActions
        isRepoForked={!!isRepoForked}
        addNewComment={addNewComment}
        handleEditIssue={handleEditIssue}
        isEditIssue={isEditIssue}
        currentBounty={currentBounty?.data}
        updateBountyData={updateBountyData}
      />

      <If condition={!!state.currentUser?.walletAddress}>
        <TabSections currentBounty={currentBounty?.data} />
      </If>

      <BountyBody 
        currentBounty={currentBounty?.data}
        updateBountyData={updateBountyData}
        isEditIssue={isEditIssue} 
        cancelEditIssue={handleCancelEditIssue}
      />

      <BountyCommentsController
        comments={commentsIssue}
        repo={currentBounty?.data?.repository?.githubPath}
        issueId={id}
      />
    </BountyEffectsProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const { id, repoId, network, chain } = query;

  api.get<IssueData>(`/issue/seo/${repoId}/${id}/${network}/${chain}`)

  const bountyDatabase = await getBountyData(query)

  const githubComments = await getBountyComments(bountyDatabase?.repository?.githubPath, +bountyDatabase?.githubId)

  const pullRequestsDetails = await getPullRequestsDetails(bountyDatabase?.repository?.githubPath,
                                                           bountyDatabase?.pullRequests);

  
  const bounty = {
    comments: githubComments,
    data: {...bountyDatabase, pullRequests: pullRequestsDetails}
  }
  
  return {
    props: {
      bounty,
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
