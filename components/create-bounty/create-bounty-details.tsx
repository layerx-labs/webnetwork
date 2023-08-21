import React, { useEffect, useState } from "react";
import { FormCheck } from "react-bootstrap";

import clsx from "clsx";
import { useTranslation } from "next-i18next";

import { PROGRAMMING_LANGUAGES } from "assets/bounty-labels";

import CheckButtons from "components/check-buttons/controller";
import { ContextualSpan } from "components/contextual-span";
import { Divider } from "components/divider";
import DropDown from "components/dropdown";
import If from "components/If";
import InfoTooltip from "components/info-tooltip";
import ReactSelect from "components/react-select";

import { useAppState } from "contexts/app-state";

import {
  BOUNTY_TITLE_LIMIT,
  MAX_TAGS,
} from "helpers/constants";

import { DetailsProps } from "interfaces/create-bounty";

import CreateBountyDescription from "./create-bounty-description";
import BountyLabel from "./create-bounty-label";

export default function CreateBountyDetails({
  title,
  updateTitle,
  description,
  updateDescription,
  files,
  updateFiles,
  selectedTags,
  updateSelectedTags,
  isKyc,
  updateIsKyc,
  updateTierList,
  updateUploading,
}: DetailsProps) {
  const { t } = useTranslation("bounty");

  const [strFiles, setStrFiles] = useState<string[]>([]);
  const [bodyLength, setBodyLength] = useState<number>(0);
  
  const {
    state: { Settings },
  } = useAppState();

  const TAGS_OPTIONS = PROGRAMMING_LANGUAGES.map(({ tag }) => ({
    label: tag,
    value: tag,
  }));

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    updateTitle(e.target.value);
  }

  function handleChangeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateDescription(e.target.value);
  }

  function handleChangeTags(newTags) {
    updateSelectedTags(newTags.map(({ value }) => value));
  }

  function handleIsKYCChecked(e: React.ChangeEvent<HTMLInputElement>) {
    updateIsKyc(e.target.checked);
  }

  useEffect(() => {
    if (description.length > 0) {
      const body = `${description}\n\n${strFiles
        .toString()
        .replace(",![", "![")
        .replace(",[", "[")}`;

      if (body?.length) setBodyLength(body.length);
    }
  }, [description, strFiles]);

  useEffect(() => {
    if (files.length > 0) {
      const strFiles = files?.map((file) =>
          file.uploaded &&
          `${file?.type?.split("/")[0] === "image" ? "!" : ""}[${file.name}](${
            Settings?.urls?.ipfs
          }/${file.hash}) \n\n`);

      setStrFiles(strFiles);
    }
  }, [files]);

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
              className={clsx("form-control form-bounty rounded-lg", {
                "border border-1 border-danger border-radius-8":
                  title.length >= BOUNTY_TITLE_LIMIT,
              })}
              placeholder={t("fields.title.placeholder")}
              value={title}
              onChange={handleChangeTitle}
            />
            
            <If condition={title.length >= BOUNTY_TITLE_LIMIT}>
              <span className="caption-small mt-3 text-danger bg-opacity-100">
                {t("errors.title-character-limit", { value: title?.length })}
              </span>
            </If> 
          </div>
        </div>
      </div>

      <div className="form-group">
        <CreateBountyDescription 
          description={description}
          handleChangeDescription={handleChangeDescription}
          bodyLength={bodyLength}
          files={files}
          updateFiles={updateFiles}
          updateUploading={updateUploading}
        />
      </div>

      <span className="text-gray">
        {t("finding-yourself-lost")}

        <a tabIndex={3} href="/explore" target="_blank" className="ms-1">
          {t("bounty-examples")}
        </a>
      </span>

      <div className="form-group mt-4 mb-0">
        <label htmlFor="" className="mb-2">
          {t("fields.tags")}
        </label>

        <ReactSelect
          value={selectedTags.map((tag) => ({ label: tag, value: tag }))}
          options={TAGS_OPTIONS}
          onChange={handleChangeTags}
          isOptionDisabled={() => selectedTags.length >= MAX_TAGS}
          isMulti
        />

        <ContextualSpan context="info" className="mt-1">
          {t("fields.tags-info")}
        </ContextualSpan>
      </div>

      <If condition={Settings?.kyc?.isKycEnabled}>
        <>
          <div className="col-md-12 d-flex flex-row gap-2 mt-4">
            <FormCheck
              className="form-control-md pb-0"
              type="checkbox"
              label={t("bounty:kyc.is-required")}
              onChange={handleIsKYCChecked}
              checked={isKyc}
            />

            <span>
              <InfoTooltip
                description={t("bounty:kyc.tool-tip")}
                secondaryIcon
              />
            </span>
          </div>

          <If condition={isKyc && !!Settings?.kyc?.tierList?.length}>
            <DropDown
              className="mt-2"
              onSelected={(opt) => {
                updateTierList(Array.isArray(opt) ? opt.map((i) => +i.value) : [+opt.value]);
              }}
              options={Settings?.kyc?.tierList.map((i) => ({
                value: i.id,
                label: i.name,
              }))}
            />
          </If>
        </>
      </If>

      <Divider />

      <div className="row">
        <div className="col">
          <div className="row">
            <span className="lg-medium text-gray-50">
              Deliverable types
            </span>
          </div>

          <div className="row mt-2">
            <span className="sm-regular text-gray-200">
              Specify the type of work for this bounty
            </span>
          </div>

          <div className="row mt-3">
            <CheckButtons
              options={[
                { label: "Code", value: "code" },
                { label: "Design", value: "design" },
                { label: "Other", value: "other" }
              ]}
              onClick={() => {}}
            />
          </div>

          <div className="row mt-3">
            <span className="sm-regular text-gray-200">
              If you have a project boilerplate, a figma design, or something that might help people to work on this bounty, you can provide a link below.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
