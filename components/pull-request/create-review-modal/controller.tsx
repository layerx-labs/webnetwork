import { ChangeEvent, useEffect, useState } from "react";

import { useAppState } from "contexts/app-state";

import { IssueBigNumberData, pullRequest } from "interfaces/issue-data";

import CreateReviewModalView from "./view";

interface CreateReviewModalModalProps {
  show: boolean;
  isExecuting: boolean;
  onConfirm: (body: string) => void;
  onCloseClick: () => void;
  pullRequest: pullRequest;
  currentBounty: IssueBigNumberData;
}

export default function CreateReviewModal({
  show = false,
  isExecuting = false,
  onConfirm,
  onCloseClick,
  pullRequest,
  currentBounty
}: CreateReviewModalModalProps) {

  const [body, setBody] = useState("");

  const { state } = useAppState();

  function isButtonDisabled(): boolean {
    return body.trim() === "" || isExecuting;
  }

  function setDefaults() {
    setBody("");
  }

  function handleConfirm() {
    onConfirm(body);
  }

  function handleChangeBody(e: ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value)
  }

  useEffect(setDefaults, [show]);

  return (
    <CreateReviewModalView 
      show={show} 
      isExecuting={isExecuting} 
      onCloseClick={onCloseClick} 
      pullRequest={pullRequest} 
      currentBounty={currentBounty} 
      githubPath={state.Service?.network?.repos?.active?.githubPath?.split("/")[1]} 
      body={body} 
      handleChangeBody={handleChangeBody} 
      isButtonDisabled={isButtonDisabled} 
      handleConfirm={handleConfirm}    
    />
  );
}