import { ChangeEvent } from "react";
import { FormControl, InputGroup } from "react-bootstrap";

import { useTranslation } from "next-i18next";

type FullNameFormProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function FullNameForm({
  value,
  onChange
}: FullNameFormProps) {
  const { t } = useTranslation("profile");

  return(
    <div className="row py-3">
      <div className="base-medium text-white mb-1">
        {t("full-name-form.title")}
      </div>

      <div className="row pb-3">
        <div className="col col-lg-4">
          <InputGroup className="border-radius-4">
            <FormControl
              placeholder={t("full-name-form.placeholder")}
              value={value}
              onChange={onChange}
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
}