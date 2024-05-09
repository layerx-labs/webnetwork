import {useEffect, useState} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import {api} from "../../../services/api";
import useReactQueryMutation from "../../../x-hooks/use-react-query-mutation";
import {AboutFormView} from "./about-form-view";

export function AboutForm() {
  const { t } = useTranslation(["profile"]);
  const { data: sessionData,} = useSession();

  const [about, setAbout] = useState<string>("");
  const [defaultValue, setDefaultValue] = useState<string>("");

  const onSaveSetAbout = () =>
    api.put(`/user/${(sessionData?.user as any)?.address}/about`, {about: about})

  const _getUserAbout = () =>
    api.get(`/user/${(sessionData?.user as any)?.address}/about`)
      .then(({data}) => {
        setDefaultValue(data);
        setAbout(data);
      });

  const {mutateAsync: getUserAbout} = useReactQueryMutation({
    mutationFn: _getUserAbout,
  })

  const {mutateAsync: saveAbout, isPending} = useReactQueryMutation({
    mutationFn: onSaveSetAbout,
    toastError: t("social.about.saving.error"),
    toastSuccess: t("social.about.saving.success"),
    onSuccess: () => {
      getUserAbout(null)
    },
  })

  useEffect(() => {
    if (!sessionData)
      return;
    getUserAbout(null);
  }, [sessionData]);

  return <AboutFormView isBodyOverLimit={about.length > 512}
                        body={about}
                        defaultValue={defaultValue}
                        onChange={(e) => setAbout(e.target.value)}
                        isSaving={isPending}
                        onSave={saveAbout} />
}