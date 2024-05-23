import {useEffect} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import {QueryKeys} from "../../../helpers/query-keys";
import {User} from "../../../interfaces/api";
import {api} from "../../../services/api";
import {useGetUserByAddress} from "../../../x-hooks/api/user";
import useReactQuery from "../../../x-hooks/use-react-query";
import useReactQueryMutation from "../../../x-hooks/use-react-query-mutation";
import {SocialFormView} from "./social-form-view";


export function SocialForm() {
  const {t} = useTranslation(["profile"]);
  const {data: sessionData} = useSession();

  const _saveSocials = ({github, linkedin, twitter}) =>
    api.put(`/user/${(sessionData?.user as User)?.address}/socials`, {
      github: github && `https://github.com/${github}` || "",
      linkedin: linkedin && `https://linkedin.com/in/${linkedin}` || "",
      twitter: twitter && `https://x.com/${twitter}` || "",
    })

  const {data: socials, refetch: refetchSocials} =
    useReactQuery(QueryKeys.userSocials(),
                  () => useGetUserByAddress((sessionData?.user as User)?.address), 
                  {enabled: !!(sessionData?.user as User)?.address, initialData: null})

  const {mutateAsync: saveSocials, isPending} = useReactQueryMutation({
    mutationFn: _saveSocials,
    toastError: t("social.error"),
    toastSuccess: t("social.success"),
    onSuccess: () => {
      refetchSocials();
    },
  })

  useEffect(() => {
    if (!sessionData)
      return;
    refetchSocials()
  }, [sessionData]);


  return <SocialFormView githubLink={socials?.githubLink?.replace("https://github.com/", "") || ""}
                         linkedInLink={socials?.linkedInLink?.replace("https://linkedin.com/in/", "") || ""}
                         twitterLink={socials?.twitterLink?.replace("https://x.com/", "") || ""}
                         onSubmit={(github: string, linkedin: string, twitter: string) => saveSocials({
                           github,
                           linkedin,
                           twitter
                         })}
                         isSaving={isPending}/>
}