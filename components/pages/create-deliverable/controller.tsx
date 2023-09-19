import { ChangeEvent, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import CreateDeliverablePageView from "components/pages/create-deliverable/view";

import { useAppState } from "contexts/app-state";

import { issueParser } from "helpers/issue";
import { QueryKeys } from "helpers/query-keys";
import { isValidUrl } from "helpers/validateUrl";

import { OriginLinkErrors } from "interfaces/enums/Errors";
import { NetworkEvents } from "interfaces/enums/events";
import { metadata } from "interfaces/metadata";

import { getBountyData } from "x-hooks/api/bounty";
import { DeletePreDeliverable, CreatePreDeliverable } from "x-hooks/api/deliverable";
import getMetadata from "x-hooks/api/get-metadata";
import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import { useNetwork } from "x-hooks/use-network";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export default function CreateDeliverablePage() {
  const { push, query } = useRouter();
  const { t } = useTranslation(["common", "deliverable", "bounty"]);

  const [originLink, setOriginLink] = useState<string>();
  const [previewLink, setPreviewLink] = useState<metadata>();
  const [previewIsLoading, setPreviewIsLoading] = useState<boolean>(false);
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [originLinkError, setOriginLinkError] = useState<OriginLinkErrors>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  
  const { state } = useAppState();
  const { getURLWithNetwork } = useNetwork();
  const { handleCreatePullRequest } = useBepro();
  
  const bountyQueryKey = QueryKeys.bounty(query?.id?.toString());
  const { data: bountyData } = useReactQuery(bountyQueryKey, () => getBountyData(query));

  const [isCreatingOnChain, createOnChain] = useContractTransaction(NetworkEvents.PullRequestCreated,
                                                                    handleCreatePullRequest,
                                                                    t("deliverable:actions.create.success"),
                                                                    t("deliverable:actions.create.error"));

  const { mutate: createPreDeliverable, isLoading: isCreatingPreDeliverable } = useReactQueryMutation({
    queryKey: bountyQueryKey,
    toastError: t("deliverable:actions.create.error"),
    mutationFn: () => CreatePreDeliverable({
      deliverableUrl: originLink,
      title,
      description,
      issueId: +currentBounty?.id,
    }),
    onSuccess: ({ bountyId, originCID, cid }) => {
      createOnChain(bountyId, originCID, cid)
        .then(() => push(getURLWithNetwork("/bounty/[id]", query)))
        .catch(() => DeletePreDeliverable(cid));
    }
  });

  const currentBounty = issueParser(bountyData);
  const checkButtonsOptions = [
    {
      label: t("bounty:fields.deliverable-types.types.code"),
      value: "code",
    },
    {
      label: t("bounty:fields.deliverable-types.types.design"),
      value: "design",
    },
    {
      label: t("bounty:fields.deliverable-types.types.other"),
      value: "other",
    },
  ];

  function handleMetadata(value: string) {
    setPreviewIsLoading(true)
    previewError && setPreviewError(false)
    getMetadata({
      url: value
    }).then(setPreviewLink)
    .catch(() => {
      setPreviewLink(undefined)
      setPreviewError(true)
    })
    .finally(() => setPreviewIsLoading(false))
  }

  function validateBannedDomain(link: string) {
    const bannedDomains = state.Service?.network?.active?.banned_domains || [];
    return !!bannedDomains.some(banned => link.toLowerCase().includes(banned.toLowerCase()));
  }

  const debouncedPreviewUpdater = useDebouncedCallback((value) => handleMetadata(value), 500);
  const validateDomainDebounced = useDebouncedCallback((link: string) => {
    if (!link) {
      setOriginLinkError(undefined);
      return;
    }
    const isValid = isValidUrl(link);
    const isBanned = validateBannedDomain(link);
    if (!isValid)
      setOriginLinkError(OriginLinkErrors.Invalid);
    else if (isBanned) 
      setOriginLinkError(OriginLinkErrors.Banned);
    else {
      setOriginLinkError(undefined);
      debouncedPreviewUpdater(link);
    }
  }, 500);

  function onChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function onChangeOriginLink(e: ChangeEvent<HTMLInputElement>) {
    setOriginLink(e.target.value);
    validateDomainDebounced(e.target.value);
  }

  function onChangeDescription(e: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.target.value);
  }

  function onHandleBack() {
    push(getURLWithNetwork("/bounty/[id]", query));
  }

  return (
    <CreateDeliverablePageView
      originLink={originLink}
      previewLink={previewLink}
      previewError={previewError}
      previewIsLoading={previewIsLoading}
      onChangeOriginLink={onChangeOriginLink}
      title={title}
      onChangeTitle={onChangeTitle}
      description={description}
      onChangeDescription={onChangeDescription}
      onHandleBack={onHandleBack}
      onHandleCreate={createPreDeliverable}
      checkButtonsOptions={checkButtonsOptions}
      checkButtonsOption={currentBounty?.type}
      createIsLoading={isCreatingPreDeliverable || isCreatingOnChain}
      originLinkError={originLinkError}
    />
  );
}
