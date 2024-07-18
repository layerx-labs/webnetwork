import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import { QueryKeys } from "helpers/query-keys";
import { lowerCaseCompare } from "helpers/string";
import { isValidEmail } from "helpers/validators/email";

import { CustomSession } from "interfaces/custom-session";
import { NotificationSettings } from "interfaces/user-notification";

import { useUpdateEmail } from "x-hooks/api/user";
import { useUpdateUserSettings } from "x-hooks/api/user/settings/use-update-settings";
import { useGetUserNotificationSettings } from "x-hooks/api/user/use-get-notification-settings";
import { useUpdateNotificationSettings } from "x-hooks/api/user/use-update-notification-settings";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

import NotificationFormView from "./view";

export default function NotificationForm() {
  const { query } = useRouter();
  const { t } = useTranslation("profile");
  const { data: sessionData, update: updateSession } = useSession();

  const [inputEmail, setInputEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const { goToProfilePage } = useMarketplace();

  const { currentUser } = useUserStore();
  const { addSuccess, addError } = useToastStore();

  const emailValidator = useDebouncedCallback(email => {
    setIsEmailInvalid(email !== "" && !isValidEmail(email));
  }, 500);

  const notificationSettingsKey = QueryKeys.userNotificationSettings(currentUser?.walletAddress);

  const { data: userNotificationSettings } = 
    useReactQuery(notificationSettingsKey,
                  async () => {
                    const settings = await useGetUserNotificationSettings(currentUser?.walletAddress);

                    if (!settings) 
                      return null;

                    const { id, userId, subscriptions, ...rest } = settings;

                    return rest;
                  },
                  {
                    enabled: !!currentUser?.walletAddress,
                    staleTime: Infinity,
                  });

  const { mutate: updateEmail, isPending: isExecutingEmail } = useReactQueryMutation({
    mutationFn: useUpdateEmail,
    onSuccess: () => {
      updateSession();
    },
    onError: error => addError(t("profile:email-errors.failed-to-update"), t(`profile:email-errors.${error}`)),
  });
  const { mutate: updateUserSettings, isPending: isUpdatingUserSettings } = useReactQueryMutation({
    mutationFn: useUpdateUserSettings,
    toastError: t("profile:notifications-form.errors.update-settings"),
    toastSuccess: t("profile:notifications-form.success-toast.settings"),
    onSuccess: () => {
      updateSession();
    },
  });
  const { mutate: updateNotificationSettings, isPending: isUpdatingNotificationSettings } = useReactQueryMutation({
    queryKey: notificationSettingsKey,
    mutationFn: useUpdateNotificationSettings,
    toastError: t("profile:notifications-settings.failed-to-update"),
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
        goToProfilePage("dashboard", { emailVerificationError: "" });
      }
    });
  }

  function onSwitchChange(newValue: boolean) {
    const language = navigator.language || (navigator as unknown as {userLanguage: string}).userLanguage;
    updateUserSettings({
      language,
      notifications: newValue
    })

    setIsNotificationEnabled(newValue);
  }

  function toggleNotificationItem(key: keyof NotificationSettings) {
    updateNotificationSettings({
      address: currentUser?.walletAddress,
      ...userNotificationSettings,
      [key]: !userNotificationSettings[key]
    });
  }

  useEffect(() => {
    setInputEmail(userEmail);
  }, [userEmail]);

  useEffect(() => {
    if(currentUser?.notifications)
      setIsNotificationEnabled(currentUser?.notifications);
  }, [currentUser]);

  useEffect(() => {
    if (query?.emailVerification === "success")
      addSuccess(t("notifications-form.success-toast.title"), t("notifications-form.success-toast.content"));
  }, [query]);

  return (
    <NotificationFormView
      userEmail={inputEmail}
      isNotificationEnabled={isNotificationEnabled}
      isSaveButtonDisabled={isSameEmail || isExecutingEmail || isEmailInvalid}
      isSwitchDisabled={isExecutingEmail || isUpdatingUserSettings || isUpdatingNotificationSettings }
      isInvalid={isEmailInvalid}
      isConfirmationPending={isConfirmationPending}
      isExecuting={isExecutingEmail}
      emailVerificationError={emailVerificationError}
      notificationSettings={userNotificationSettings || {}}
      toggleNotificationItem={toggleNotificationItem}
      onChange={handleEmailChange}
      onSave={onSave}
      onResend={onResend}
      onSwitchChange={onSwitchChange}
    />
  );
}
