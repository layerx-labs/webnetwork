import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import ProfilePageView from "components/profile/pages/profile-page/view";

import { useAppState } from "contexts/app-state";

import { lowerCaseCompare } from "helpers/string";
import { isValidEmail } from "helpers/validators/email";

import { CustomSession } from "interfaces/custom-session";

import useApi from "x-hooks/use-api";
import { useAuthentication } from "x-hooks/use-authentication";

export default function ProfilePage() {
  const { query } = useRouter();
  const { data: sessionData, status, update: updateSession } = useSession();

  const [inputEmail, setInputEmail] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const emailValidator = useDebouncedCallback(email => {
    setIsEmailInvalid(email !== "" && !isValidEmail(email));
  }, 500);

  const { state } = useAppState();
  const { updateUserEmail } = useApi();
  const { signOut } = useAuthentication();

  const sessionUser = (sessionData as CustomSession)?.user;
  const userEmail = sessionUser?.email || "";
  const isConfirmationPending = !!userEmail && !sessionUser?.isEmailConfirmed;
  const isSameEmail = lowerCaseCompare(userEmail, inputEmail);

  const handleClickDisconnect = () => setShowRemoveModal(true);
  const hideRemoveModal = () => setShowRemoveModal(false);

  function handleEmailChange(e) {
    setInputEmail(e.target.value);
    emailValidator(e.target.value);
  }

  function handleUpdateEmail(email: string) {
    setIsExecuting(true);

    updateUserEmail(email)
      .catch(error => {
        console.debug("Failed to update user email", error);
      })
      .finally(() => {
        setIsExecuting(false);
        updateSession();
      });
  }

  function onSave() {
    handleUpdateEmail(inputEmail);
  }

  function onResend() {
    handleUpdateEmail(userEmail);
  }

  function onSwitchChange(newValue: boolean) {
    if (!newValue) {
      if (!isExecuting && userEmail !== "")
        handleUpdateEmail("");
      else
        setIsNotificationEnabled(false);
    } else
      setIsNotificationEnabled(true);
  }

  useEffect(() => {
    if (status === "authenticated") {
      setInputEmail(userEmail);

      if (!!userEmail !== isNotificationEnabled) 
        setIsNotificationEnabled(!!userEmail);
    }
  }, [sessionData, status]);

  return (
    <ProfilePageView
      userLogin={state.currentUser?.login}
      userEmail={inputEmail}
      onSave={onSave}
      onResend={onResend}
      isSaveButtonDisabled={isSameEmail || isExecuting || isEmailInvalid}
      emailVerificationError={query?.emailVerificationError?.toString()?.replace("Error: ", "")}
      isSwitchDisabled={isExecuting}
      isEmailInvalid={isEmailInvalid}
      isExecuting={isExecuting}
      handleEmailChange={handleEmailChange}
      isNotificationEnabled={isNotificationEnabled}
      isConfirmationPending={isConfirmationPending}
      walletAddress={state.currentUser?.walletAddress}
      isCouncil={state.Service?.network?.active?.isCouncil}
      handleClickDisconnect={handleClickDisconnect}
      hideRemoveModal={hideRemoveModal}
      showRemoveModal={showRemoveModal}
      disconnectGithub={signOut}
      onSwitchChange={onSwitchChange}
    />
  );
}
