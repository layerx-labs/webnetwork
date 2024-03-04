import { useTranslation } from "next-i18next";
import getConfig from "next/config";
import { useRouter } from "next/router";

import LanguageFormView from "components/profile/language-form/language-form.view";

import { SelectOption } from "types/utils";

import { useUpdateUserSettings } from "x-hooks/api/user/settings";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

const { publicRuntimeConfig } = getConfig();
export default function LanguageForm () {
  const router = useRouter();
  const { t } = useTranslation(["common", "profile"]);

  const {currentUser} = useUserStore();
  const { addSuccess } = useToastStore();
  const {mutate, isPending} = useReactQueryMutation({
    mutationFn: (languageOption: SelectOption) =>
      useUpdateUserSettings({language: languageOption?.value?.toString()}),
    onSuccess: () => {
      router.replace(router.asPath);
      addSuccess(t("actions.success"), t("profile:language-updated"));
    }
  });

  const languages = publicRuntimeConfig?.locales?.map(locale => ({
    label: t(`locales.${locale}`),
    value: locale
  }));

  return (
    <LanguageFormView
      currentLanguage={languages.find(l => l.value === currentUser?.language)}
      languages={languages}
      isLoading={isPending}
      onLanguageChange={mutate}
    />
  );
}