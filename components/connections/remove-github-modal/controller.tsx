import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import RemoveGithubAccountView from "components/connections/remove-github-modal/view";

import { useRemoveGithub } from "x-hooks/api/user";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
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

  const { addError } = useToastStore();
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

        addError(t("modals.remove-github.errors.failed-to-remove"), message[error?.response?.data?.toString()]);
      } else
      addError(t("modals.remove-github.errors.failed-to-remove"), t("modals.remove-github.errors.check-requirements"));
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
