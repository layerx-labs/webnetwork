import {useEffect, useState} from "react";
import {FormControl, InputGroup} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import Button from "../../button";


export function SocialFormView({onSubmit, githubLink, linkedInLink, isSaving}) {
  const { t } = useTranslation(["common", "profile"]);

  const [ghLink, setGhLink] =
    useState<string>(githubLink);
  const [liLink, setLinkedInLink] =
    useState<string>(linkedInLink);

  const isFormValid = () => (githubLink !== ghLink || linkedInLink !== liLink) && !isSaving;

  const rows = [
    {text: t("profile:social.github"), onChange: setGhLink, value: ghLink},
    {text: t("profile:social.linkedin"), onChange: setLinkedInLink, value: liLink},
  ]

  useEffect(() => {
    setGhLink(githubLink);
    setLinkedInLink(linkedInLink);
  }, [githubLink, linkedInLink]);

  return <div className="row py-3">
    <div className="base-medium text-white mb-1">{t("profile:social.title")}</div>
    <div className="text-gray-500 xs-medium font-weight-normal mb-3">{t("profile:social.subtitle")}</div>
      {
        rows.map((row, i) => (
          <div className="row pb-3" key={i}>
            <div className="col col-lg-4">
              <InputGroup className="border-radius-4">
                <InputGroup.Text>{row.text}</InputGroup.Text>
                <FormControl value={row.value} onChange={e => row.onChange(e.target.value)} />
              </InputGroup>
            </div>
          </div>
        ))
      }
      <div className="row mt-3">
        <div className="col">
          <Button onClick={() => onSubmit(ghLink, liLink)} disabled={!isFormValid()}>
            <span>{t("common:save")}</span>
            {isSaving ? (<span className="spinner-border spinner-border-xs ml-1" />) : ("")}
          </Button>
        </div>
      </div>
    </div>
}