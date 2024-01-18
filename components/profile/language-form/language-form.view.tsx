import { useTranslation } from "next-i18next";

import ReactSelect from "components/react-select";

import { SelectOption } from "types/utils";

interface LanguageFormViewProps {
  currentLanguage: SelectOption;
  languages: SelectOption[];
  isLoading?: boolean;
  onLanguageChange: (language: SelectOption) => void;
}

export default function LanguageFormView ({
  currentLanguage,
  languages,
  isLoading,
  onLanguageChange,
}: LanguageFormViewProps) {
  const { t } = useTranslation("profile");

  return (
    <div className="row mb-4 mt-4">
      <div
        className="col-12 col-sm-auto"
        data-test-id="language-selector-container"
        data-testid="language-selector-container"
      >
        <span className="base-medium text-white mb-1 d-block">
          {t("platform-language")}
        </span>

        <ReactSelect
          value={currentLanguage}
          options={languages}
          inputProps={{ 'data-test-id': 'language-select' }}
          onChange={onLanguageChange}
          isDisabled={isLoading}
        />
      </div>
    </div>
  );
}