import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import { lowerCaseCompare } from "helpers/string";
import { isValidEmail } from "helpers/validators/email";

import { CustomSession } from "interfaces/custom-session";

import { useUpdateEmail } from "x-hooks/api/user";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

import NotificationFormView from "./view";

export default function NotificationForm() {
  const { query } = useRouter();
  const { t } = useTranslation("profile");
  const { data: sessionData, update: updateSession } = useSession();

  const [inputEmail, setInputEmail] = useState("");

  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const emailValidator = useDebouncedCallback(email => {
    setIsEmailInvalid(email !== "" && !isValidEmail(email));
  }, 500);

  const { goToProfilePage } = useMarketplace();
  const { addSuccess } = useToastStore();
  const { mutate: updateEmail, isLoading: isExecutingEmail } = useReactQueryMutation({
    mutationFn: useUpdateEmail,
    toastError: t("profile:email-errors.failed-to-update"),
    onSuccess: () => {
      updateSession();
    }
  });

  const sessionUser = (sessionData as CustomSession)?.user;
  const userEmail = sessionUser?.email || "";
  const isConfirmationPending = !!userEmail && !sessionUser?.isEmailConfirmed;
  const isSameEmail = lowerCaseCompare(userEmail, inputEmail);
  const emailVerificationError = query?.emailVerificationError?.toString()?.replace("Error: ", "");

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
      if (!isExecutingEmail && userEmail !== "")
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
  }, [query]);

  return (
    <NotificationFormView
      userEmail={inputEmail}
      isNotificationEnabled={isNotificationEnabled}
      isSaveButtonDisabled={isSameEmail || isExecutingEmail || isEmailInvalid}
      isSwitchDisabled={isExecutingEmail}
      isInvalid={isEmailInvalid}
      isConfirmationPending={isConfirmationPending}
      isExecuting={isExecutingEmail}
      emailVerificationError={emailVerificationError}
      onChange={handleEmailChange}
      onSave={onSave}
      onResend={onResend}
      onSwitchChange={onSwitchChange}
    />
  );
}
