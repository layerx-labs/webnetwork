import {useEffect, useState} from "react";
import {FormControl, InputGroup} from "react-bootstrap";

import {useTranslation} from "next-i18next";

import Button from "../../button";


export function SocialFormView({onSubmit, githubLink, linkedInLink, twitterLink, isSaving}) {
  const { t } = useTranslation(["common", "profile"]);

  const [ghLink, setGhLink] =
    useState<string>(githubLink);
  const [liLink, setLinkedInLink] =
    useState<string>(linkedInLink);
  const [twitter, setTwitterLink] =
    useState<string>(twitterLink);

  const isInputValid = (txt: string) => /^[a-zA-Z0-9_]*$/.test(txt);

  const isFormValid = () =>
    (githubLink !== ghLink || linkedInLink !== liLink || twitter !== twitterLink) &&
    (ghLink && isInputValid(ghLink) || true) &&
    (liLink && isInputValid(liLink) || true) &&
    (twitter && isInputValid(twitter) || true) &&
    !isSaving;

  const selectInput = (id: string) =>
    (document.querySelector(`#${id}`) as HTMLInputElement)?.select();


  const rows = [
    {text: t("profile:social.github"), onChange: setGhLink, value: ghLink, id: "github-link"},
    {text: t("profile:social.linkedin"), onChange: setLinkedInLink, value: liLink, id: "linkedin-link"},
    {text: t("profile:social.twitter"), onChange: setTwitterLink, value: twitter, id: "twitter-link"},
  ]

  useEffect(() => {
    setGhLink(githubLink);
    setLinkedInLink(linkedInLink);
    setTwitterLink(twitterLink);
  }, [githubLink, linkedInLink, twitterLink]);

  return <div className="row py-3">
    <div className="base-medium text-white mb-1">{t("profile:social.title")}</div>
    <div className="text-gray-500 xs-medium font-weight-normal mb-3">{t("profile:social.subtitle")}</div>
      {
        rows.map((row, i) => (
          <div className="row pb-3" key={i}>
            <div className="col col-lg-4">
              <InputGroup className="border-radius-4">
                <InputGroup.Text onClick={() => selectInput(row.id)}>{row.text}</InputGroup.Text>
                <FormControl id={row.id} value={row.value} onChange={e => row.onChange(e.target.value)}/>
              </InputGroup>
              <p style={{display: (!!row.value && !isInputValid(row.value)) ? "block" : "" }} className="invalid-feedback p-small mt-2 mb-0">{t("profile:social.invalid-input")}</p>
            </div>
          </div>
        ))
      }
    <div className="row mt-3">
      <div className="col">
        <Button onClick={() => onSubmit(ghLink, liLink, twitter)} disabled={!isFormValid()}>
            <span>{t("common:save")}</span>
            {isSaving ? (<span className="spinner-border spinner-border-xs ml-1" />) : ("")}
          </Button>
        </div>
      </div>
    </div>
}