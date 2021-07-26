import { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react';
import IssueComments from '../components/issue-comments';
import IssueDescription from '../components/issue-description';
import IssueHero from '../components/issue-hero';
import IssueDraftProgress from '../components/issue-draft-progress';
import PageActions from '../components/page-actions';
import IssueProposals from '../components/issue-proposals';
import { mockNewIssues } from '../helpers/mockdata/mockIssues';
import { mockCommentsIssue } from '../helpers/mockdata/mockCommentsIssue';

export default function PageIssue() {
  return (
    <>

      <IssueHero></IssueHero>

       {/*<IssueDraftProgress></IssueDraftProgress>
      {/*<IssueProposals></IssueProposals>

      <PageActions></PageActions>

      <IssueDescription></IssueDescription>*/}
      <IssueComments url="/" comments={mockCommentsIssue}></IssueComments>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
}
