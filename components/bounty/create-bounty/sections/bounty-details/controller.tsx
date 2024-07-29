import { ChangeEvent } from "react";

import { useTranslation } from "next-i18next";

import BountyDetailsSectionView from "components/bounty/create-bounty/sections/bounty-details/view";

import {
  BOUNTY_TAGS,
  BOUNTY_TITLE_LIMIT,
  MAX_TAGS,
} from "helpers/constants";
import { getOriginLinkPlaceholder } from "helpers/origin-link-placeholder";

import { BountyDetailsSectionProps } from "interfaces/create-bounty";

import { SelectOption } from "types/utils";

import { useSettings } from "x-hooks/use-settings";

export default function BountyDetailsSection({
  title,
  updateTitle,
  description,
  updateDescription,
  selectedTags,
  updateSelectedTags,
  isKyc,
  originLink,
  originLinkError,
  deliverableType,
  privateDeliverable,
  multipleWinners,
  handlePrivateDeliverableChecked,
  onOriginLinkChange,
  updateIsKyc,
  updateTierList,
  setDeliverableType,
  onMultipleWinnersChange
}: BountyDetailsSectionProps) {
  const { t } = useTranslation("bounty");
  
  const { settings } = useSettings();

  const TAGS_OPTIONS = BOUNTY_TAGS.map(({ type, tags }) => ({
    label: type,
    options: tags.map((tag) => ({
      label: tag,
      value: tag,
    }))
  }));

  const kycTierOptions = settings?.kyc?.tierList?.map((i) => ({
    value: i.id,
    label: i.name,
  }));

  const deliverableTypes = [
    { label: t("fields.deliverable-types.types.code"), value: "code" },
    { label: t("fields.deliverable-types.types.design"), value: "design" },
    { label: t("fields.deliverable-types.types.other"), value: "other" }
  ];

  function handleChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    updateTitle(e.target.value);
  }

  function handleChangeDescription(value: string) {
    updateDescription(value);
  }

  function handleChangeTags(newTags) {
    updateSelectedTags(newTags.map(({ value }) => value));
  }

  function handleIsKYCChecked(e: ChangeEvent<HTMLInputElement>) {
    updateIsKyc(e.target.checked);
  }

  function onPrivateDeliverableChecked(e: ChangeEvent<HTMLInputElement>) {
    handlePrivateDeliverableChecked(e.target.checked);
  }

  function onMultipleWinnersChecked(e: ChangeEvent<HTMLInputElement>) {
    onMultipleWinnersChange(e.target.checked);
  }
  
  function handleDeliverableTypeClick(selected: SelectOption | SelectOption[]) {
    const selectedType = Array.isArray(selected) ? selected.at(0) : selected;

    setDeliverableType(selectedType?.value?.toString());
  }

  function handleOriginLinkChange(e: ChangeEvent<HTMLInputElement>) {
    onOriginLinkChange(e.target.value)
  }

  function onKycTierChange(opt) {
    updateTierList(Array.isArray(opt) ? opt.map((i) => +i.value) : [+opt.value]);
  }

  return (
    <BountyDetailsSectionView
      title={title}
      description={description}
      tags={selectedTags.map((tag) => ({ label: tag, value: tag }))}
      tagsOptions={TAGS_OPTIONS}
      titleExceedsLimit={title?.length >= BOUNTY_TITLE_LIMIT}
      kycCheck={isKyc}
      isKycEnabled={settings?.kyc?.isKycEnabled}
      kycOptions={kycTierOptions}
      deliverableTypeOptions={deliverableTypes}
      deliverableType={deliverableType}
      originLink={originLink}
      originLinkError={originLinkError}
      originLinkPlaceHolder={getOriginLinkPlaceholder(t, deliverableType)}
      onTitlechange={handleChangeTitle}
      onDescriptionchange={handleChangeDescription}
      onTagsChange={handleChangeTags}
      isTagsSelectDisabled={() => selectedTags.length >= MAX_TAGS}
      onKycCheckChange={handleIsKYCChecked}
      onKycTierChange={onKycTierChange}
      onDeliverableTypeClick={handleDeliverableTypeClick}
      onOriginLinkchange={handleOriginLinkChange}
      privateDeliverable={privateDeliverable}
      multipleWinners={multipleWinners}
      onPrivateDeliverableChecked={onPrivateDeliverableChecked}
      onMultipleWinnersChecked={onMultipleWinnersChecked}
    />
  );
}
