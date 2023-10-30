import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import ProfilePageView from "components/profile/pages/profile-page/view";

import { useAppState } from "contexts/app-state";

import { lowerCaseCompare } from "helpers/string";
import { isValidEmail } from "helpers/validators/email";

import { CustomSession } from "interfaces/custom-session";

import { useUpdateEmail } from "x-hooks/api/user";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useAuthentication } from "x-hooks/use-authentication";
import { useNetwork } from "x-hooks/use-network";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export default function ProfilePage() {
  const { query } = useRouter();
  const { t } = useTranslation("profile");
  const { data: sessionData, update: updateSession } = useSession();

  const [inputEmail, setInputEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const emailValidator = useDebouncedCallback(email => {
    setIsEmailInvalid(email !== "" && !isValidEmail(email));
  }, 500);

  const { state } = useAppState();
  const { goToProfilePage } = useNetwork();
  const { signInGithub } = useAuthentication();
  const { addError, addSuccess } = useToastStore();
  const { mutate: updateEmail, isLoading: isExecuting } = useReactQueryMutation({
    mutationFn: useUpdateEmail,
    toastError: t("email-errors.failed-to-update"),
    onSuccess: () => {
      updateSession();
    }
  });

  const sessionUser = (sessionData as CustomSession)?.user;
  const userEmail = sessionUser?.email || "";
  const isConfirmationPending = !!userEmail && !sessionUser?.isEmailConfirmed;
  const isSameEmail = lowerCaseCompare(userEmail, inputEmail);
  const emailVerificationError = query?.emailVerificationError?.toString()?.replace("Error: ", "");

  const handleClickDisconnect = () => setShowRemoveModal(true);
  const hideRemoveModal = () => setShowRemoveModal(false);
  const hideConnectModal = () => setShowConnectModal(false);
  const onChangeMyHandleClick = () => setShowConnectModal(true);

  function handleEmailChange(e) {
    setInputEmail(e.target.value);
    emailValidator(e.target.value);
  }

  function onSave() {
    updateEmail(inputEmail);
  }

  function onResend() {
    updateEmail(userEmail, {
      onSuccess: () => {
        goToProfilePage("profile", { emailVerificationError: "" });
      }
    });
  }

  function onSwitchChange(newValue: boolean) {
    if (!newValue) {
      if (!isExecuting && userEmail !== "")
        updateEmail("");
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

  useEffect(() => {
    if (query?.emailVerification === "success")
      addSuccess(t("notifications-form.success-toast.title"), t("notifications-form.success-toast.content"));
    if (query?.isGithubLoginExist === "true")
      addError("", t("modals.connect-github.errors.github-already-exists"));
  }, [query]);

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
      onHandleEmailChange={handleEmailChange}
      isNotificationEnabled={isNotificationEnabled}
      isConfirmationPending={isConfirmationPending}
      walletAddress={state.currentUser?.walletAddress}
      isCouncil={state.Service?.network?.active?.isCouncil}
      onHandleClickDisconnect={handleClickDisconnect}
      onHideRemoveModal={hideRemoveModal}
      showRemoveModal={showRemoveModal}
      showConnectModal={showConnectModal}
      onHideModalClick={hideConnectModal}
      onChangeMyHandleClick={onChangeMyHandleClick}
      onDisconnectGithub={updateSession}
      onConnectGithub={signInGithub}
      onSwitchChange={onSwitchChange}
    />
  );
}
