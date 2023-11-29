import {useEffect, useState} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {useDebouncedCallback} from "use-debounce";

import ProfilePageView from "components/profile/pages/profile-page/view";

import {useAppState} from "contexts/app-state";

import {lowerCaseCompare} from "helpers/string";
import {isValidEmail} from "helpers/validators/email";
import { handleValidator } from "helpers/validators/handle-validator";

import {CustomSession} from "interfaces/custom-session";

import { useUpdateEmail } from "x-hooks/api/user";
import { useCheckHandle } from "x-hooks/api/user/use-check-handle";
import { useUpdateHandle } from "x-hooks/api/user/use-update-handle";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";
export interface UserNameInvalid {
  invalid: boolean;
  text?: string;
}

export default function ProfilePage() {
  const { query } = useRouter();
  const { t } = useTranslation("profile");
  const { data: sessionData, update: updateSession } = useSession();

  const [inputEmail, setInputEmail] = useState("");
  const [inputUserName, setInputUserName] = useState("");
  const [isEditUserName, setIsEditUserName] = useState(false);
  const [isUserNameInvalid, setIsUserNameInvalid] = useState<UserNameInvalid>({
    invalid: null
  });
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const emailValidator = useDebouncedCallback(email => {
    setIsEmailInvalid(email !== "" && !isValidEmail(email));
  }, 500);
  
  const handleNameValidator = useDebouncedCallback((value: string) => {
    const isValid = handleValidator(value)
    const isEqualSessionName = sessionUser?.login?.toLowerCase() === value?.toLowerCase()
    
    if(isEqualSessionName) {
      setIsUserNameInvalid({ invalid: false })
      return; 
    }

    if(isValid){
      useCheckHandle(value)
        .then((invalid) =>
          setIsUserNameInvalid({
            invalid,
            text: t("profile:user-name.errors.already-exists"),
          }))
        .catch(() => {
          setIsUserNameInvalid({
            invalid: true,
            text: t("profile:user-name.errors.check-handle"),
          });
        });
    } else setIsUserNameInvalid({
      invalid: !isValid,
      text: t("profile:user-name.errors.invalid-name")
    })
  }, 500);

  const { state } = useAppState();
  const { goToProfilePage } = useMarketplace();
  const { addSuccess } = useToastStore();
  const { mutate: updateEmail, isLoading: isExecutingEmail } = useReactQueryMutation({
    mutationFn: useUpdateEmail,
    toastError: t("profile:email-errors.failed-to-update"),
    onSuccess: () => {
      updateSession();
    }
  });
  const { mutate: updateHandle, isLoading: isExecutingHandle } = useReactQueryMutation({
    mutationFn: useUpdateHandle,
    toastError: t("profile:user-name.errors.update-handle"),
    onSuccess: () => {
      updateSession();
      setIsEditUserName(false);
    },
    toastSuccess: t("profile:user-name.success")
  });

  const sessionUser = (sessionData as CustomSession)?.user;
  const isEqualSessionName = sessionUser?.login?.toLowerCase() === inputUserName?.toLowerCase()
  const userEmail = sessionUser?.email || "";
  const isConfirmationPending = !!userEmail && !sessionUser?.isEmailConfirmed;
  const isSameEmail = lowerCaseCompare(userEmail, inputEmail);
  const emailVerificationError = query?.emailVerificationError?.toString()?.replace("Error: ", "");

  function handleEmailChange(e) {
    setInputEmail(e.target.value);
    emailValidator(e.target.value);
  }

  function handleUserNameChange(e) {
    setInputUserName(e.target.value);
    handleNameValidator(e.target.value);
  }

  function onSave(type: 'email' | 'handle') {
    if(type === 'email')
      updateEmail(inputEmail);
    if(type === 'handle')
      updateHandle({ address: sessionUser?.address, handle: inputUserName});
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
    if(sessionUser?.login){
      setInputUserName(sessionUser?.login)
      setIsUserNameInvalid({ invalid: false });
    }
      
  }, [sessionUser])

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
    <ProfilePageView
      userEmail={inputEmail}
      userName={inputUserName}
      onSaveEmail={() => onSave('email')}
      onSaveHandle={() => onSave('handle')}
      onResend={onResend}
      sessionUserName={sessionUser?.login}
      isSaveEmailDisabled={isSameEmail || isExecutingEmail || isEmailInvalid}
      isSaveUserNameDisabled={!inputUserName || isUserNameInvalid?.invalid || isExecutingHandle || isEqualSessionName}
      isEditUserName={isEditUserName}
      onHandleEditUserName={(e: boolean) => setIsEditUserName(e)}
      emailVerificationError={emailVerificationError}
      isSwitchDisabled={isExecutingEmail}
      isEmailInvalid={isEmailInvalid}
      userNameInvalid={isUserNameInvalid}
      isExecutingEmail={isExecutingEmail}
      isExecutingHandle={isExecutingHandle}
      onHandleEmailChange={handleEmailChange}
      onHandleUserNameChange={handleUserNameChange}
      isNotificationEnabled={isNotificationEnabled}
      isConfirmationPending={isConfirmationPending}
      walletAddress={state.currentUser?.walletAddress}
      isCouncil={state.currentUser?.isCouncil}
      onSwitchChange={onSwitchChange}
    />
  );
}
