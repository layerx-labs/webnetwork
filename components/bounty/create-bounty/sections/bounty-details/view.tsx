import { ChangeEvent } from "react";
import { Form, FormCheck } from "react-bootstrap";

import clsx from "clsx";
import { useTranslation } from "next-i18next";

import BountyLabel from "components/bounty/create-bounty/create-bounty-label";
import CheckButtons from "components/check-buttons/controller";
import DescriptionAndPreview from "components/common/description-and-preview/controller";
import { ContextualSpan } from "components/contextual-span";
import { Divider } from "components/divider";
import DropDown, { DropdownOption } from "components/dropdown";
import If from "components/If";
import InfoTooltip from "components/info-tooltip";
import ReactSelect from "components/react-select";

import { OriginLinkErrors } from "interfaces/enums/Errors";

import { GroupedSelectOption, SelectOption } from "types/utils";

interface BountyDetailsSectionViewProps {
  title: string;
  description: string;
  tags: SelectOption[];
  tagsOptions: GroupedSelectOption[];
  titleExceedsLimit: boolean;
  isKycEnabled: boolean;
  privateDeliverable: boolean;
  kycCheck: boolean;
  kycOptions: DropdownOption[];
  deliverableTypeOptions: SelectOption[];
  originLink: string;
  deliverableType: string;
  originLinkError: OriginLinkErrors;
  originLinkPlaceHolder: string;
  onTitlechange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionchange: (value: string) => void;
  onTagsChange: (tags: SelectOption[]) => void;
  isTagsSelectDisabled: () => boolean;
  onKycCheckChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPrivateDeliverableChecked: (e: ChangeEvent<HTMLInputElement>) => void;
  onKycTierChange: (value: DropdownOption | DropdownOption[]) => void;
  onDeliverableTypeClick: (tags: SelectOption | SelectOption[]) => void;
  onOriginLinkchange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function BountyDetailsSectionView({
  title,
  description,
  tags,
  tagsOptions,
  titleExceedsLimit,
  kycCheck,
  isKycEnabled,
  kycOptions,
  deliverableTypeOptions,
  originLink,
  originLinkPlaceHolder,
  deliverableType,
  originLinkError,
  privateDeliverable,
  onTitlechange,
  onDescriptionchange,
  onTagsChange,
  isTagsSelectDisabled,
  onKycCheckChange,
  onKycTierChange,
  onDeliverableTypeClick,
  onOriginLinkchange,
  onPrivateDeliverableChecked,
}: BountyDetailsSectionViewProps) {
  const { t } = useTranslation("bounty");

  return (
    <>
      <div className="mt-2 mb-4">
        <h5>{t("steps.details")}</h5>

        <p className="text-gray">
          {t("descriptions.details")}
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-12 m-0 mb-2">
          <div className="form-group">
            <BountyLabel className="mb-2" required>
              {t("fields.title.label")}
            </BountyLabel>

            <input
              type="text"
              className={clsx("form-control rounded-lg", {
                "border border-1 border-danger border-radius-8": titleExceedsLimit,
              })}
              data-testid="title-input"
              placeholder={t("fields.title.placeholder")}
              value={title}
              onChange={onTitlechange}
            />
            
            <If condition={titleExceedsLimit}>
              <span className="caption-small mt-3 text-danger bg-opacity-100">
                {t("errors.title-character-limit", { value: title?.length })}
              </span>
            </If> 
          </div>
        </div>
      </div>

      <div className="form-group">
        <DescriptionAndPreview
          description={description}
          handleChangeDescription={onDescriptionchange}
        />
      </div>

      <span className="text-gray">
        {t("finding-yourself-lost")}

        <a tabIndex={3} href="/explore" target="_blank" className="ms-1">
          {t("bounty-examples")}
        </a>
      </span>

      <div className="form-group mt-4 mb-0">
        <BountyLabel className="mb-2" required data-testid="task-tags-select">
          {t("fields.tags")}
        </BountyLabel>

        <ReactSelect
          data-testid="tags"
          value={tags}
          options={tagsOptions}
          onChange={onTagsChange}
          isOptionDisabled={isTagsSelectDisabled}
          isMulti
        />

        <ContextualSpan context="info" className="mt-1">
          {t("fields.tags-info")}
        </ContextualSpan>
      </div>

      <If condition={isKycEnabled}>
        <>
          <div className="col-md-12 d-flex flex-row gap-2 mt-4">
            <FormCheck
              data-testid="checkbox-kyc"
              className="form-control-md pb-0"
              type="checkbox"
              label={t("bounty:kyc.is-required")}
              onChange={onKycCheckChange}
              checked={kycCheck}
            />

            <span>
              <InfoTooltip
                description={t("bounty:kyc.tool-tip")}
                secondaryIcon
              />
            </span>
          </div>

          <If condition={kycCheck && !!kycOptions?.length}>
            <DropDown
              data-testid="dropdown-kyc"
              className="mt-2"
              onSelected={onKycTierChange}
              options={kycOptions}
            />
          </If>
        </>
      </If>

      <Divider />

      <div className="row">
        <div className="col">
          <h5>{t("steps.deliverable-options")}</h5>

          <div className="row">
            <BountyLabel required>
              {t("fields.deliverable-types.label")}
            </BountyLabel>
          </div>

          <div className="row mt-2">
            <span className="sm-regular text-gray-200">
            {t("fields.deliverable-types.description")}
            </span>
          </div>

          <div className="row mt-3">
            <CheckButtons
              checked={deliverableType}
              options={deliverableTypeOptions}
              onClick={onDeliverableTypeClick}
            />
          </div>

          <div className="row mt-4">
            <BountyLabel>
              {t("fields.private-deliverable.label")}
            </BountyLabel>
          </div>

          <div className="row mt-2">
            <div className="d-flex align-items-center gap-2">
              <Form.Check
                className="form-control-md mb-1"
                type="switch"
                id="private-deliverable-switch"
                data-testid="private-deliverable-switch"
                onChange={onPrivateDeliverableChecked}
                checked={privateDeliverable}
              />

              <span className="sm-regular text-gray-200">
                {t("fields.private-deliverable.description")}
              </span>
            </div>
          </div>

          <div className="row mt-3 mb-2">
            <span className="sm-regular text-gray-200 mt-2 mb-1">
              {t("fields.origin-link.description")}
            </span>
          </div>

          <div className="row">
            <div className="col-12 col-lg-7">
              <label htmlFor="origin-link" className="mb-2">
                {t("fields.origin-link.label")}
              </label>

              <input
                type="text"
                name="origin-link"
                id="origin-link"
                data-testid="origin-link-input"
                placeholder={originLinkPlaceHolder}
                className={`form-control ${originLinkError ? "is-invalid" : ""}`}
                value={originLink}
                onChange={onOriginLinkchange}
              />

              <If condition={originLinkError === OriginLinkErrors.Banned}>
                <ContextualSpan context="danger" className="mt-2">
                  {t("errors.banned-domain")}
                </ContextualSpan>
              </If>

              <If condition={originLinkError === OriginLinkErrors.Invalid}>
                <ContextualSpan context="danger" className="mt-2">
                  {t("errors.invalid-link")}
                </ContextualSpan>
              </If>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}