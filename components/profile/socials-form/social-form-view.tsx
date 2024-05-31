import {FormControl, InputGroup} from "react-bootstrap";

import {useTranslation} from "next-i18next";


export function SocialFormView({
                                 githubLink,
                                 linkedInLink,
                                 twitterLink,
                                 onChange, ghLink, liLink, twitter,
                               }) {
  const { t } = useTranslation(["common", "profile"]);


  const isInputValid = (txt: string) => /^[a-zA-Z0-9_]*$/.test(txt);



  const selectInput = (id: string) =>
    (document.querySelector(`#${id}`) as HTMLInputElement)?.select();


  const rows = [
    {text: t("profile:social.github"), onChange: (value: string) => onChange(value, "github"), value: ghLink, dvalue: githubLink, id: "github-link"},
    {text: t("profile:social.linkedin"), onChange: (value: string) => onChange(value, "linkedin"), value: liLink, dvalue: linkedInLink, id: "linkedin-link"},
    {text: t("profile:social.twitter"), onChange: (value: string) => onChange(value, "xcom"), value: twitter, dvalue: twitterLink, id: "xcom-link"},
  ]

  return <div className="row py-3">
    <div className="base-medium text-white mb-1">{t("profile:social.title")}</div>
    <div className="text-gray-500 xs-medium font-weight-normal mb-3">{t("profile:social.subtitle")}</div>
      {
        rows.map((row, i) => (
          <div className="row pb-3" key={i}>
            <div className="col col-lg-4">
              <InputGroup className="border-radius-4">
                <InputGroup.Text onClick={() => selectInput(row.id)}>{row.text}</InputGroup.Text>
                <FormControl id={row.id} defaultValue={row.dvalue} onChange={e => row.onChange(e.target.value)}/>
              </InputGroup>
              <p 
                style={{display: (!!row.value && !isInputValid(row.value)) ? "block" : "" }} 
                className="invalid-feedback p-small mt-2 mb-0">{t("profile:social.invalid-input")}</p>
            </div>
          </div>
        ))
      }

    </div>
}