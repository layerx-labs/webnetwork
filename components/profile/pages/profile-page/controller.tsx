import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import ProfilePageView from "components/profile/pages/profile-page/view";

import { useAppState } from "contexts/app-state";
import { toastError } from "contexts/reducers/change-toaster";

import { lowerCaseCompare } from "helpers/string";
import { isValidEmail } from "helpers/validators/email";

import { CustomSession } from "interfaces/custom-session";

import useApi from "x-hooks/use-api";
import { useAuthentication } from "x-hooks/use-authentication";

export default function ProfilePage() {
  const { query } = useRouter();
  const { t } = useTranslation("profile");
  const { data: sessionData, update: updateSession } = useSession();

  const [inputEmail, setInputEmail] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const emailValidator = useDebouncedCallback(email => {
    setIsEmailInvalid(email !== "" && !isValidEmail(email));
  }, 500);

  const { state, dispatch } = useAppState();
  const { updateUserEmail } = useApi();
  const { signOut } = useAuthentication();

  const sessionUser = (sessionData as CustomSession)?.user;
  const userEmail = sessionUser?.email || "";
  const isConfirmationPending = !!userEmail && !sessionUser?.isEmailConfirmed;
  const isSameEmail = lowerCaseCompare(userEmail, inputEmail);
  const emailVerificationError = query?.emailVerificationError?.toString()?.replace("Error: ", "");

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
        dispatch(toastError(t("email-errors.try-again-later"), t("email-errors.failed-to-update")));
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
    setInputEmail(userEmail);

    if (!!userEmail !== isNotificationEnabled) 
      setIsNotificationEnabled(!!userEmail);
  }, [userEmail]);

  return (
    <ProfilePageView
      userLogin={state.currentUser?.login}
      userEmail={inputEmail}
      onSave={onSave}
      onResend={onResend}
      isSaveButtonDisabled={isSameEmail || isExecuting || isEmailInvalid}
      emailVerificationError={emailVerificationError}
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
