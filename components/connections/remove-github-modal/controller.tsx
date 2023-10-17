import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import RemoveGithubAccountView from "components/connections/remove-github-modal/view";

import { useAppState } from "contexts/app-state";
import { toastError } from "contexts/reducers/change-toaster";

import { useRemoveGithub } from "x-hooks/api/user";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

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

  const { dispatch } = useAppState();
  const { mutate: removeGithub, isLoading: isExecuting } = useReactQueryMutation({
    mutationFn: () => useRemoveGithub({
      address: walletAddress,
      githubLogin
    }),
    toastSuccess: t("modals.remove-github.success"),
    onSuccess: () => {
      onDisconnectGithub();
      onCloseClick();
    },
    onError: (error: AxiosError) => {
      if (error?.response?.status === 409) {
        const message = {
          PULL_REQUESTS_OPEN: t("modals.remove-github.errors.deliverables-open"),
        };

        dispatch(toastError(message[error?.response?.data?.toString()],
                            t("modals.remove-github.errors.failed-to-remove")));
      } else
        dispatch(toastError(t("modals.remove-github.errors.check-requirements"),
                            t("modals.remove-github.errors.failed-to-remove")));
    }
  });

  return (
    <RemoveGithubAccountView
      show={show}
      isLoading={isExecuting}
      githubLogin={githubLogin}
      walletAddress={walletAddress}
      onCloseClick={onCloseClick}
      onOkClick={removeGithub}
    />
  );
}
