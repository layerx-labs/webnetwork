import {useState} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import {QueryKeys} from "../../../helpers/query-keys";
import {api} from "../../../services/api";
import {useUserStore} from "../../../x-hooks/stores/user/user.store";
import useReactQuery from "../../../x-hooks/use-react-query";
import useReactQueryMutation from "../../../x-hooks/use-react-query-mutation";
import {AboutFormView} from "./about-form-view";

export function AboutForm() {
  const { t } = useTranslation(["profile"]);
  const { data: sessionData,} = useSession();
  const {currentUser} = useUserStore()

  const [about, setAbout] = useState<string>("");

  const onSaveSetAbout = () =>
    api.put(`/user/${currentUser?.walletAddress}/about`, {about: about})

  const getUserAbout = () =>
    api.get(`/user/${currentUser?.walletAddress}/about`)
      .then(({data}) => {
        return data;
      });

  const {data: defaultAbout, invalidate: invalidateAbout} =
    useReactQuery(QueryKeys.about(), getUserAbout)

  const {mutateAsync: saveAbout, isPending} = useReactQueryMutation({
    mutationFn: onSaveSetAbout,
    toastError: t("social.about.saving.error"),
    toastSuccess: t("social.about.saving.success"),
    onSuccess: () => {
      invalidateAbout()
    },
  })

  return <AboutFormView isBodyOverLimit={about.length > 512}
                        body={about}
                        defaultValue={defaultAbout}
                        onChange={(e) => setAbout(e.target.value)}
                        isSaving={isPending}
                        onSave={saveAbout} />
}