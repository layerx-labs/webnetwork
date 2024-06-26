import { ChangeEvent, useState } from "react";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useDebouncedCallback } from "use-debounce";

import CreateDeliverablePageView from "components/pages/create-deliverable/view";

import { issueParser } from "helpers/issue";
import { getOriginLinkPlaceholder } from "helpers/origin-link-placeholder";
import { QueryKeys } from "helpers/query-keys";
import { isValidUrl } from "helpers/validateUrl";

import { OriginLinkErrors } from "interfaces/enums/Errors";
import { NetworkEvents } from "interfaces/enums/events";

import { DeletePreDeliverable, CreatePreDeliverable } from "x-hooks/api/deliverable";
import { getBountyData } from "x-hooks/api/task";
import useBepro from "x-hooks/use-bepro";
import useContractTransaction from "x-hooks/use-contract-transaction";
import useMarketplace from "x-hooks/use-marketplace";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export default function CreateDeliverablePage() {
  const { push, query } = useRouter();
  const { t } = useTranslation(["common", "deliverable", "bounty"]);

  const [originLink, setOriginLink] = useState<string>();
  const [originLinkError, setOriginLinkError] = useState<OriginLinkErrors>();
  const [previewStatus, setPreviewStatus] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [createdDeliverableId, setCreatedDeliverableId] = useState<number>();

  const { handleCreatePullRequest } = useBepro();
  const { active: activeMarketplace, getURLWithNetwork } = useMarketplace();

  const bountyQueryKey = QueryKeys.bounty(query?.id?.toString());
  const { data: bountyData } = useReactQuery(bountyQueryKey, () => getBountyData(query));

  const [isCreatingOnChain, createOnChain] = useContractTransaction(NetworkEvents.PullRequestCreated,
                                                                    handleCreatePullRequest,
                                                                    t("deliverable:actions.create.success"),
                                                                    t("deliverable:actions.create.error"));

  const { mutate: createPreDeliverable, isPending: isCreatingPreDeliverable } = useReactQueryMutation({
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
        .then(() => setCreatedDeliverableId(cid))
        .catch(() => {
          setCreatedDeliverableId(undefined);
          DeletePreDeliverable(cid);
        });
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

  function validateBannedDomain(link: string) {
    const bannedDomains = activeMarketplace?.banned_domains || [];
    return !!bannedDomains.some(banned => link.toLowerCase().includes(banned.toLowerCase()));
  }

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
    }
  }, 500);

  function onChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  function onChangeOriginLink(e: ChangeEvent<HTMLInputElement>) {
    setOriginLink(e.target.value);
    validateDomainDebounced(e.target.value);
  }

  function onChangeDescription(value: string) {
    setDescription(value);
  }

  function onHandleBack() {
    push(getURLWithNetwork("/task/[id]", query));
  }

  return (
    <CreateDeliverablePageView
      originLink={originLink}
      originLinkPlaceHolder={getOriginLinkPlaceholder(t, currentBounty?.type)}
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
      createdDeliverableId={createdDeliverableId}
      bountyContractId={currentBounty?.contractId}
      onPreviewStatusChange={setPreviewStatus}
      previewError={previewStatus === "error"}
      previewLoading={previewStatus === "loading"}
    />
  );
}
