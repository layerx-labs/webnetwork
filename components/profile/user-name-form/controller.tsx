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

export interface UserhandleInvalid {
  invalid: boolean;
  text?: string;
}

export default function UserNameForm() {
  const { t } = useTranslation(["common", " profile"]);
  const { data: sessionData, update: updateSession } = useSession();

  const [inputUserhandle, setInputUserhandle] = useState("");
  const [isEditUserhandle, setIsEditUserhandle] = useState(false);
  const [isUserhandleInvalid, setIsUserhandleInvalid] = useState<UserhandleInvalid>({
    invalid: null
  });

  const { mutate: updateHandle, isLoading: isExecutingHandle } = useReactQueryMutation({
    mutationFn: useUpdateHandle,
    toastError: t("profile:user-name.errors.update-handle"),
    onSuccess: () => {
      updateSession();
      setIsEditUserhandle(false);
    },
    toastSuccess: t("profile:user-name.success")
  });

  const sessionUser = (sessionData as CustomSession)?.user;
  const isEqualSessionName = sessionUser?.login?.toLowerCase() === inputUserhandle?.toLowerCase();


  const handleNameValidator = useDebouncedCallback((value: string) => {
    const isValid = handleValidator(value)
    const isEqualSessionName = sessionUser?.login?.toLowerCase() === value?.toLowerCase()
    
    if(isEqualSessionName) {
      setIsUserhandleInvalid({ invalid: false })
      return; 
    }

    if(isValid){
      useCheckHandle(value)
        .then((invalid) =>
          setIsUserhandleInvalid({
            invalid,
            text: t("profile:user-name.errors.already-exists"),
          }))
        .catch(() => {
          setIsUserhandleInvalid({
            invalid: true,
            text: t("profile:user-name.errors.check-handle"),
          });
        });
    } else setIsUserhandleInvalid({
      invalid: !isValid,
      text: t("profile:user-name.errors.invalid-name")
    })
  }, 200);

  function handleUserNameChange(e) {
    setInputUserhandle(e.target.value);
    handleNameValidator(e.target.value);
  }

  function onSave() {
    updateHandle({ address: sessionUser?.address, handle: inputUserhandle});
  }

  useEffect(() => {
    if(sessionUser?.login){
      setInputUserhandle(sessionUser?.login)
      setIsUserhandleInvalid({ invalid: false });
    }
      
  }, [sessionUser])

  return (
    <UserNameFormView 
      userhandle={inputUserhandle}
      sessionUserhandle={sessionUser?.login}
      isEditting={isEditUserhandle}
      isSaveButtonDisabled={
        !inputUserhandle ||
        isUserhandleInvalid?.invalid ||
        isExecutingHandle ||
        isEqualSessionName
      }
      validity={isUserhandleInvalid}
      isExecuting={isExecutingHandle}
      isApproved={isUserhandleInvalid?.invalid === false}
      onChange={handleUserNameChange}
      onEditClick={(e: boolean) => setIsEditUserhandle(e)}
      onSave={onSave}
    />
  );
}
