import {useEffect, useState} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import {api} from "../../../services/api";
import useReactQueryMutation from "../../../x-hooks/use-react-query-mutation";
import {SocialFormView} from "./social-form-view";


export function SocialForm() {
  const { t } = useTranslation(["profile"]);
  const { data: sessionData, update: updateSession } = useSession();
  const [socials, setSocials] =
    useState<{github: string, linkedIn: string}>({} as any);

  const _saveSocials = ({github, linkedin}) =>
    api.put(`/user/${(sessionData?.user as any)?.address}/socials`, {
      github: github && `https://github.com/${github}` || "",
      linkedin: linkedin && `https://linkedin.com/in/${linkedin}` || ""
    })

  const {mutateAsync: saveSocials, isPending} = useReactQueryMutation({
    mutationFn: _saveSocials,
    toastError: t("social.success"),
    toastSuccess: t("social.error"),
    onSuccess: () => {
      updateSession();
    },
  })

  useEffect(() => {
    if (!sessionData)
      return;

    setSocials({
      github: (sessionData?.user as any)?.github?.replace("https://github.com/", ""),
      linkedIn: (sessionData?.user as any)?.linkedIn?.replace("https://linkedin.com/in/", "")
    })
  }, [sessionData]);

  return <SocialFormView githubLink={socials.github || ""}
                         linkedInLink={socials.linkedIn || ""}
                         onSubmit={(github: string, linkedin: string) => saveSocials({github, linkedin}) }
                         isSaving={isPending} />
}