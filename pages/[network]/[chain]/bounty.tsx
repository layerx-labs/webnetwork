import React, {useEffect, useState} from "react";

import { SSRConfig } from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {GetServerSideProps} from "next/types";

import BountyBody from "components/bounty/body/controller";
import BountyHero from "components/bounty/bounty-hero/controller";
import BountyComments from "components/bounty/comments/controller";
import FundingSection from "components/bounty/funding-section/controller";
import PageActions from "components/bounty/page-actions/controller";
import TabSections from "components/bounty/tabs-sections/controller";
import CustomContainer from "components/custom-container";
import If from "components/If";

import {useAppState} from "contexts/app-state";
import { BountyEffectsProvider } from "contexts/bounty-effects";

import { issueParser } from "helpers/issue";

import { CurrentBounty } from "interfaces/application-state";
import { IssueData, IssueDataComment } from "interfaces/issue-data";

import { 
  getBountyData,
  getBountyOrPullRequestComments,
  getPullRequestsDetails
} from "x-hooks/api/bounty/get-bounty-data";
import useApi from "x-hooks/use-api";

interface PageBountyProps {
  bounty: {
    comments: IssueDataComment[];
    data: IssueData;
  }
  _nextI18Next?: SSRConfig;
}

export default function PageIssue({ bounty }: PageBountyProps) {
  const [currentBounty, setCurrentBounty] = useState<CurrentBounty>({
    data: issueParser(bounty?.data),
    comments: bounty?.comments,
    lastUpdated: 0,
  });
  const [commentsIssue, setCommentsIssue] = useState([...currentBounty?.comments || []]);
  const [isEditIssue, setIsEditIssue] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();

  const {state} = useAppState();
  const router = useRouter();
  const { getUserOf } = useApi();

  const { id } = router.query;

  async function updateBountyData(updatePrData = false) {
    const bountyDatabase = await getBountyData(router.query)

    if(updatePrData) {
      const pullRequests = await getPullRequestsDetails(bountyDatabase?.repository?.githubPath,
                                                        bountyDatabase?.pullRequests);
      setCurrentBounty({
        data: { ...issueParser(bountyDatabase), pullRequests},
        comments: commentsIssue,
        lastUpdated: 0
      })
    } else {
      setCurrentBounty({
        data: { ...issueParser(bountyDatabase), pullRequests: currentBounty?.data?.pullRequests },
        comments: commentsIssue,
        lastUpdated: 0
      })
    }
  }

  async function handleEditIssue() {
    setIsEditIssue(true);
  }

  function handleCancelEditIssue() {
    setIsEditIssue(false)
  }

  function addNewComment(comment) {
    setCommentsIssue([...commentsIssue, comment]);
  }

  useEffect(() => {
    if(!state.currentUser?.walletAddress) return;

    getUserOf(state.currentUser?.walletAddress?.toLowerCase()).then(({id}) => setUserId(id))
  }, [state.currentUser?.walletAddress])

  return (
    <BountyEffectsProvider currentBounty={bounty}>
      <BountyHero 
        currentBounty={currentBounty?.data}
        updateBountyData={updateBountyData}
        handleEditIssue={handleEditIssue}
        isEditIssue={isEditIssue}
      />
    
      <CustomContainer>
        <If condition={!!currentBounty?.data?.isFundingRequest}>
          <FundingSection 
            currentBounty={currentBounty?.data}
            updateBountyData={updateBountyData}
          /> 
        </If>

        <PageActions
          addNewComment={addNewComment}
          handleEditIssue={handleEditIssue}
          isEditIssue={isEditIssue}
          currentBounty={currentBounty?.data}
          currentUserId={userId}
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

        <BountyComments
          comments={commentsIssue}
          repo={currentBounty?.data?.repository?.githubPath}
          issueId={id}
        />
      </CustomContainer>
    </BountyEffectsProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({query, locale}) => {
  const bountyDatabase = await getBountyData(query)

  const githubComments = await getBountyOrPullRequestComments(bountyDatabase?.repository?.githubPath, 
                                                              +bountyDatabase?.githubId);

  const pullRequestsDetails = await getPullRequestsDetails(bountyDatabase?.repository?.githubPath,
                                                           bountyDatabase?.pullRequests);
  
  const bounty = {
    comments: githubComments,
    data: {...bountyDatabase, pullRequests: pullRequestsDetails}
  }
  
  const seoData: Partial<IssueData> = {
    title: bountyDatabase?.title,
    body: bountyDatabase?.body,
    issueId: bountyDatabase?.issueId
  }

  return {
    props: {
      seoData,
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
