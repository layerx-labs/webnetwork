import {useEffect, useState} from "react";

import {useTranslation} from "next-i18next";

import {api} from "../../../services/api";
import {useUserStore} from "../../../x-hooks/stores/user/user.store";
import useReactQueryMutation from "../../../x-hooks/use-react-query-mutation";
import {AboutFormView} from "./about-form-view";

export function AboutForm() {
  const { t } = useTranslation(["profile"]);
  const {currentUser} = useUserStore()

  const [about, setAbout] = useState<string>("");
  const [defaultAbout, setDefaultAbout] = useState<string>("");

  const onSaveSetAbout = () =>
    api.put(`/user/${currentUser?.walletAddress}/about`, {about: about})

  const getUserAbout = () =>
    api.get(`/user/${currentUser?.walletAddress}/about`)
      .then(({data}) => data || "")
      .catch(e => {
        console.log(`Failed to fetch about information`, e);
        return "";
      });

  const updateAboutForm = () => {
    if (!currentUser?.walletAddress)
      return;

    getUserAbout().then(setDefaultAbout);
  }

  const {mutateAsync: saveAbout, isPending} = useReactQueryMutation({
    mutationFn: onSaveSetAbout,
    toastError: t("social.about.saving.error"),
    toastSuccess: t("social.about.saving.success"),
    onSuccess: () => {
      updateAboutForm();
    },
  })

  useEffect(updateAboutForm, [currentUser]);

  return <AboutFormView isBodyOverLimit={about.length > 512}
                        body={about}
                        defaultValue={defaultAbout}
                        onChange={(e) => setAbout(e.target.value)}
                        isSaving={isPending}
                        onSave={saveAbout} />
}