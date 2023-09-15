import { useState } from "react";

import { useTranslation } from "next-i18next";

import RemoveGithubAccountView from "components/connections/remove-github-modal/view";

import { useAppState } from "contexts/app-state";
import { toastError, toastSuccess } from "contexts/reducers/change-toaster";

import { useRemoveGithub } from "x-hooks/api/user";

interface RemoveGithubAccountProps {
  show: boolean;
  githubLogin: string;
  walletAddress: string;
  onCloseClick: () => void;
  onDisconnectGithub: () => void;
}

export default function RemoveGithubAccount({
  show,
  githubLogin,
  walletAddress,
  onCloseClick,
  onDisconnectGithub,
}: RemoveGithubAccountProps) {
  const { t } = useTranslation(["profile", "common"]);
  const [isExecuting, setIsExecuting] = useState(false);

  const { dispatch } = useAppState();

  function handleClickRemove() {
    setIsExecuting(true);

    useRemoveGithub(walletAddress, githubLogin)
      .then(onDisconnectGithub)
      .then(() => {
        dispatch(toastSuccess(t("modals.remove-github.success")));
        onCloseClick();
      })
      .catch((error) => {
        if (error?.response?.status === 409) {
          const message = {
            PULL_REQUESTS_OPEN: t("modals.remove-github.errors.deliverables-open"),
          };

          dispatch(toastError(message[error.response.data],
                              t("modals.remove-github.errors.failed-to-remove")));
        } else
          dispatch(toastError(t("modals.remove-github.errors.check-requirements"),
                              t("modals.remove-github.errors.failed-to-remove")));
      })
      .finally(() => setIsExecuting(false));
  }

  return (
    <RemoveGithubAccountView
      show={show}
      isLoading={isExecuting}
      githubLogin={githubLogin}
      walletAddress={walletAddress}
      onCloseClick={onCloseClick}
      onOkClick={handleClickRemove}
    />
  );
}
