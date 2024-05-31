import {FormControl, InputGroup} from "react-bootstrap";

import {useTranslation} from "next-i18next";

export function AboutFormView({onChange, isBodyOverLimit, defaultValue = "", body = "", isSaving}) {
  const {t} = useTranslation(["profile"]);

  return <div className="row py-3">
    <div className="base-medium text-white mb-1">{t("profile:social.about.title")}</div>
    <div className="text-gray-500 xs-medium font-weight-normal mb-3">{t("profile:social.about.subtitle")}</div>
    <div className="row pb-3">
      <div className="col col-lg-4">
        <InputGroup className="border-radius-8">
          <FormControl as="textarea"
                       placeholder={t("profile:social.about.placeholder")}
                       defaultValue={defaultValue}
                       cols={30}
                       rows={5}
                       onChange={onChange}/>
        </InputGroup>
        <p style={{display: (!!body && isBodyOverLimit) ? "block" : ""}} className="invalid-feedback p-small mt-2 mb-0">
          {t("profile:social.about.body-length-limit", {value: body.length,})}
        </p>
      </div>
    </div>
  </div>
}