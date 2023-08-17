import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "use-debounce";

import ProfilePageView from "components/profile/pages/profile-page/view";

import { useAppState } from "contexts/app-state";

import { lowerCaseCompare } from "helpers/string";
import { isValidEmail } from "helpers/validators/email";

import useApi from "x-hooks/use-api";
import { useAuthentication } from "x-hooks/use-authentication";

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();

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

  const userEmail = session?.user?.email || "";
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
  }, [session, status]);

  return (
    <ProfilePageView
      userLogin={state.currentUser?.login}
      userEmail={inputEmail}
      onSave={onSave}
      isSaveButtonDisabled={isSameEmail || isExecuting || isEmailInvalid}
      isSwitchDisabled={isExecuting}
      isEmailInvalid={isEmailInvalid}
      handleEmailChange={handleEmailChange}
      isNotificationEnabled={isNotificationEnabled}
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
