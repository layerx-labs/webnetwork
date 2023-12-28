import { useState } from "react";

import { useTranslation } from "next-i18next";
import { useDebounce } from "use-debounce";
import { isAddress } from "web3-utils";

import AllowListView from "components/network/settings/permissions/allow-list/allow-list-view";

import { QueryKeys } from "helpers/query-keys";

import { AllowListTypes } from "interfaces/enums/marketplace";

import useAddAllowListEntry from "x-hooks/api/marketplace/management/allow-list/use-add-allow-list-entry";
import useDeleteAllowListEntry
  from "x-hooks/api/marketplace/management/allow-list/use-delete-allow-list-entry";
import useGetAllowList from "x-hooks/api/marketplace/management/allow-list/use-get-allow-list";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

type AllowListProps = {
  networkId: number,
  networkAddress: string,
  type: AllowListTypes,
};

export default function AllowList ({
  networkId,
  networkAddress,
  type
}: AllowListProps) {
  const { t } = useTranslation(["custom-network"]);

  const [address, setAddress] = useState("");

  const [dAddress] = useDebounce(address, 300);

  const queryKey = QueryKeys.allowListByType(type, networkId);
  const {
    data: allowListOfNetwork,
    isFetching,
    isLoading
  } = useReactQuery<string[]>(queryKey, () => useGetAllowList(networkId, type));
  const { mutate: onAddClick, isLoading: isAdding } = useReactQueryMutation({
    queryKey,
    mutationFn: useAddAllowListEntry,
    toastSuccess: t("steps.permissions.allow-list.success.address-allowed"),
    toastError: t("steps.permissions.allow-list.error.could-not-add-address"),
    onSuccess: () => setAddress(""),
    onError: console.debug
  });
  const { mutate: onTrashClick, isLoading: isRemoving } = useReactQueryMutation({
    queryKey,
    mutationFn: useDeleteAllowListEntry,
    toastSuccess: t("steps.permissions.allow-list.success.address-removed"),
    toastError: t("steps.permissions.allow-list.error.could-not-remove-address"),
    onError: console.debug
  })

  function inputError () {
    return !isAddress(address) ? "not-address" : allowListOfNetwork.includes(address) ? "already-exists" : "";
  }

  return (
    <AllowListView
      error={inputError()}
      allowList={allowListOfNetwork}
      isLoading={isLoading || isFetching}
      isAdding={isAdding}
      isRemoving={isRemoving}
      value={address}
      type={type}
      onValueChange={setAddress}
      onAddClick={() => onAddClick({
        networkId,
        address: dAddress,
        networkAddress,
        type,
      })}
      onTrashClick={(address) => onTrashClick({ networkId, address, type })}
    />
  );
}