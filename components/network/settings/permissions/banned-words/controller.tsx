import {useState} from "react";

import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import NetworkPermissionsView from "components/network/settings/permissions/banned-words/view";

import { QueryKeys } from "helpers/query-keys";

import { Network } from "interfaces/network";

import { CreateBannedWord, RemoveBannedWord } from "x-hooks/api/marketplace/management/banned-words";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useChain from "x-hooks/use-chain";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

interface NetworkPermissionsProps {
  network: Network;
}

export default function NetworkPermissions({
  network
}: NetworkPermissionsProps) {
  const { t } = useTranslation(["custom-network", "common"]);

  const [currentDomain, setCurrentDomain] = useState<string>();

  const { chain } = useChain();
  const { currentUser } = useUserStore();
  const { addError } = useToastStore();

  const networkQueryKey = QueryKeys.networksByGovernor(currentUser?.walletAddress, chain?.chainId?.toString());

  const { mutate: addBannedWord, isLoading: isAdding } = useReactQueryMutation({
    queryKey: networkQueryKey,
    mutationFn: CreateBannedWord,
    toastSuccess: t("steps.permissions.domains.created-message"),
    onSuccess: () => {
      setCurrentDomain("");
    },
    onError: (error) => {
      if((error as AxiosError).response?.status === 409)
        addError(t("common:actions.failed"), t("steps.permissions.domains.already-exists"));
      else
        addError(t("common:actions.failed"), t("steps.permissions.domains.created-error"));
    }
  });

  const { mutate: removeBannedWord, isLoading: isRemoving } = useReactQueryMutation({
    queryKey: networkQueryKey,
    mutationFn: (domain: string) => RemoveBannedWord({
      networkId: network.id,
      banned_domain: domain,
      networkAddress: network?.networkAddress?.toLowerCase(),
    }),
    toastSuccess: t("steps.permissions.domains.remove-message"),
    onSuccess: () => {
      setCurrentDomain("");
    },
    onError: (error) => {
      if((error as AxiosError).response?.status === 404)
        addError(t("common.actions.failed"), t("steps.permissions.domains.remove-not-found"));
      else
      addError(t("common.actions.failed"), t("steps.permissions.domains.remove-error"));
    }
  });

  return (
    <NetworkPermissionsView
      domain={currentDomain}
      domains={network?.banned_domains}
      onChangeDomain={setCurrentDomain}
      handleAddDomain={() => addBannedWord({
        networkId: network?.id,
        banned_domain: currentDomain,
        networkAddress: network?.networkAddress?.toLowerCase(),
      })}
      handleRemoveDomain={removeBannedWord}
      isExecuting={isAdding || isRemoving}
    />
  );
}
