import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useDebouncedCallback } from "use-debounce";

import { handleValidator } from "helpers/validators/handle-validator";

import { CustomSession } from "interfaces/custom-session";

import { useCheckHandle } from "x-hooks/api/user/use-check-handle";
import { useUpdateHandle } from "x-hooks/api/user/use-update-handle";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

import UserNameFormView from "./view";

export interface UserNameInvalid {
  invalid: boolean;
  text?: string;
}

export default function UserNameForm() {
  const { t } = useTranslation(["common", " profile"]);
  const { data: sessionData, update: updateSession } = useSession();

  const [inputUserName, setInputUserName] = useState("");
  const [isEditUserName, setIsEditUserName] = useState(false);
  const [isUserNameInvalid, setIsUserNameInvalid] = useState<UserNameInvalid>({
    invalid: null
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
  const isEqualSessionName = sessionUser?.login?.toLowerCase() === inputUserName?.toLowerCase();


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

  function handleUserNameChange(e) {
    setInputUserName(e.target.value);
    handleNameValidator(e.target.value);
  }

  function onSave() {
    updateHandle({ address: sessionUser?.address, handle: inputUserName});
  }

  useEffect(() => {
    if(sessionUser?.login){
      setInputUserName(sessionUser?.login)
      setIsUserNameInvalid({ invalid: false });
    }
      
  }, [sessionUser])

  return (
    <UserNameFormView 
      userhandle={inputUserName} 
      sessionUserhandle={sessionUser?.login} 
      isEditting={isEditUserName} 
      isSaveButtonDisabled={!inputUserName || isUserNameInvalid?.invalid || isExecutingHandle || isEqualSessionName} 
      validity={isUserNameInvalid} 
      isExecuting={isExecutingHandle} 
      isApproved={isUserNameInvalid?.invalid === false} 
      onChange={handleUserNameChange} 
      onEditClick={(e: boolean) => setIsEditUserName(e)} 
      onSave={onSave} 
    />
  );
}
