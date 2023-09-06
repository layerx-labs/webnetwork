import { ChangeEvent } from "react";

import clsx from "clsx";
import { useTranslation } from "next-i18next";

import CreateBountyDescription from "components/bounty/create-bounty/create-bounty-description";
import BountyLabel from "components/bounty/create-bounty/create-bounty-label";
import CheckButtons from "components/check-buttons/controller";
import CustomContainer from "components/custom-container";
import ResponsiveWrapper from "components/responsive-wrapper";

import { SelectOption } from "types/utils";

import FooterButtons from "./footer-buttons/view";

interface CreateDeliverablePageViewProps {
  checkButtonsOptions: SelectOption[];
  checkButtonsOption: string;
  originLink: string;
  onChangeOriginLink: (v: ChangeEvent<HTMLInputElement>) => void;
  description: string;
  onChangeDescription: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  title: string;
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  onHandleBack: () => void;
  onHandleCreate: () => void;
}

export default function CreateDeliverablePageView({
  originLink,
  onChangeOriginLink,
  title,
  onChangeTitle,
  description,
  onChangeDescription,
  onHandleBack,
  onHandleCreate,
  checkButtonsOption,
  checkButtonsOptions,
}: CreateDeliverablePageViewProps) {
  const { t } = useTranslation(["common", "bounty", "deliverable"]);

  return (
    <div className="row justify-content-center mx-0">
      <div className="col-md-10 bg-gray-900 border border-gray-800 border-radius-4 mt-5 p-4">
        <div>
          <h5>{t("deliverable:create.title")}</h5>
          <p className="text-gray-200">{t("deliverable:create.description")}</p>
        </div>
        <div className="pt-2">
          <span>{t("deliverable:create.type")}</span>
          <p className="text-gray-200">
            {t("deliverable:create.description-type")}
          </p>
        </div>
        <div className="mb-4 mt-4">
          <p>{t("deliverable:create.type")}</p>
          <CheckButtons
            checked={checkButtonsOption}
            options={checkButtonsOptions}
          />
        </div>

        <div>
          <p className="text-gray-200">{t("deliverable:create.info-type")}</p>
        </div>

        <div>
          <div className="row justify-content-center mb-3">
            <div className="col-md-12 m-0 mb-2">
              <div className="form-group">
                <BountyLabel className="mb-2 text-white" required>
                  {t("deliverable:create.labels.origin-link")}
                </BountyLabel>
                <input
                  type="text"
                  className={clsx("form-control bg-gray-850 rounded-lg", {
                    "border border-1 border-danger border-radius-8": false,
                  })}
                  placeholder={t("deliverable:create.placeholders.origin-link")}
                  value={originLink}
                  onChange={onChangeOriginLink}
                />
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-12 m-0 mb-2">
              <div className="form-group">
                <BountyLabel className="mb-2 text-white">
                  {t("deliverable:create.labels.preview")}
                </BountyLabel>
                <div className="d-flex justify-content-center border-dotter border-radius-4 border-gray-800">
                  <span className="p-5 text-gray-800">
                    {t("deliverable:create.placeholders.preview")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-md-12 m-0 mb-2">
              <div className="form-group">
                <BountyLabel className="mb-2 text-white" required>
                  {t("deliverable:create.labels.title")}
                </BountyLabel>
                <input
                  type="text"
                  className={clsx("form-control bg-gray-850 rounded-lg", {
                    "border border-1 border-danger border-radius-8": false,
                  })}
                  placeholder={t("deliverable:create.placeholders.title")}
                  value={title}
                  onChange={onChangeTitle}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <CreateBountyDescription
              description={description}
              handleChangeDescription={onChangeDescription}
              borderColor="gray-800"
              textAreaColor="gray-850"
            />
          </div>

          <p className="text-gray-200">
            {t("deliverable:create.markdown-helper")}{" "}
            <a
              href="https://www.markdownguide.org/getting-started/"
              target="_blank"
            >
              {t("deliverable:create.markdown-link")}
            </a>
          </p>
        </div>
      </div>
      <CustomContainer className="d-flex flex-column justify-content-end">
        <ResponsiveWrapper className="row my-4" xs={false} md={true}>
          <FooterButtons
            handleBack={onHandleBack}
            handleCreate={onHandleCreate}
          />
        </ResponsiveWrapper>
        <ResponsiveWrapper className="row my-4 mx-1" xs={true} md={false}>
          <FooterButtons
            handleBack={onHandleBack}
            handleCreate={onHandleCreate}
          />
        </ResponsiveWrapper>
      </CustomContainer>
    </div>
  );
}
