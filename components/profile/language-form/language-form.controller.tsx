import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";

import LanguageFormView from "components/profile/language-form/language-form.view";

import { SelectOption } from "types/utils";

import { useUpdateUserSettings } from "x-hooks/api/user/settings";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

const { publicRuntimeConfig } = getConfig();
export default function LanguageForm () {
  const session = useSession();
  const { t } = useTranslation(["common", "profile"]);

  const {currentUser} = useUserStore();
  const {mutate, isLoading} = useReactQueryMutation({
    mutationFn: (languageOption: SelectOption) =>
      useUpdateUserSettings({language: languageOption?.value?.toString()}),
    onSuccess: () => session.update()
  });

  const languages = publicRuntimeConfig?.locales?.map(locale => ({
    label: t(`locales.${locale}`),
    value: locale
  }));

  return (
    <LanguageFormView
      currentLanguage={languages.find(l => l.value === currentUser?.language)}
      languages={languages}
      isLoading={isLoading}
      onLanguageChange={mutate}
    />
  );
}