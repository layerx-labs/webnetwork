import {useState} from "react";

import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import NetworkPermissionsView from "components/network/settings/permissions/banned-words/view";

import { useAppState } from "contexts/app-state";
import { toastError, toastSuccess } from "contexts/reducers/change-toaster";

import { Network } from "interfaces/network";

import { CreateBannedWord, RemoveBannedWord } from "x-hooks/api/network/management/banned-words";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

interface NetworkPermissionsProps {
  network: Network;
  networkQueryKey: string[];
}

export default function NetworkPermissions({
  network,
  networkQueryKey,
}: NetworkPermissionsProps) {
  const { t } = useTranslation(["custom-network"]);

  const [currentDomain, setCurrentDomain] = useState<string>();

  const { dispatch } = useAppState();

  const { mutate: addBannedWord, isLoading: isAdding } = useReactQueryMutation({
    queryKey: networkQueryKey,
    mutationFn: () => CreateBannedWord({
      networkId: network?.id,
      banned_domain: currentDomain,
      networkAddress: network?.networkAddress?.toLowerCase(),
    }),
    toastSuccess: t("steps.permissions.domains.created-message"),
    onSuccess: () => {
      setCurrentDomain("");
    },
    onError: (error) => {
      if((error as AxiosError).response?.status === 409)
        dispatch(toastError(t("steps.permissions.domains.already-exists")));
      else
        dispatch(toastError(t("steps.permissions.domains.created-error")));
    }
  });

  function handleRemoveDomain(domain: string) {
    RemoveBannedWord(network.id, {
      banned_domain: domain,
      networkAddress: network?.networkAddress?.toLowerCase(),
    }).then(() => {
      dispatch(toastSuccess(t("steps.permissions.domains.remove-message")));
    }).catch(err => {
      if(err.response?.status === 404){
        return dispatch(toastError(t("steps.permissions.domains.remove-not-found")));
      }
      console.debug("Error remove banned word", err);
      return dispatch(toastError(t("steps.permissions.domains.remove-error")));
    })
  }

  return (
    <NetworkPermissionsView
      domain={currentDomain}
      domains={network?.banned_domains}
      onChangeDomain={setCurrentDomain}
      handleAddDomain={addBannedWord}
      handleRemoveDomain={handleRemoveDomain}
      isExecuting={isAdding}
    />
  );
}
