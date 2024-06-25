import React, {useEffect, useState} from "react";

import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import { FullNameForm } from "components/profile/full-name-form/full-name-form.view";

import { useUpdateFullName } from "x-hooks/api/user/use-update-full-name";

import {QueryKeys} from "../../../helpers/query-keys";
import {User} from "../../../interfaces/api";
import {api} from "../../../services/api";
import {useGetUserByAddress} from "../../../x-hooks/api/user";
import {useUserStore} from "../../../x-hooks/stores/user/user.store";
import useReactQuery from "../../../x-hooks/use-react-query";
import useReactQueryMutation from "../../../x-hooks/use-react-query-mutation";
import Button from "../../button";
import {Divider} from "../../divider";
import {AboutFormView} from "../about-form/about-form-view";
import {SocialFormView} from "../socials-form/social-form-view";

export function AboutSocial() {
  const [about, setAbout] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [xcom, setXCom] = useState<string>("");
  const [linkedin, setLinkedIn] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  const {t} = useTranslation(["profile"]);
  const {data: sessionData, update: updateSession } = useSession();
  const {currentUser} = useUserStore()

  const onSaveSocials = () =>
    api.put(`/user/${(sessionData?.user as User)?.address}/socials`, {
      github: github && `https://github.com/${github}` || "",
      linkedin: linkedin && `https://linkedin.com/in/${linkedin}` || "",
      twitter: xcom && `https://x.com/${xcom}` || "",
    })

  const onSaveSetAbout = () =>
    api.put(`/user/${currentUser?.walletAddress}/about`, {about})

  const onSaveFullName = () => useUpdateFullName({ address: currentUser?.walletAddress, fullName });

  const getUserAbout = () =>
    api.get(`/user/${currentUser?.walletAddress}/about`)
      .then(({data}) => data || "")
      .catch(e => {
        console.log(`Failed to fetch about information`, e);
        return "";
      });

  const {data: socials, refetch: refetchSocials} =
    useReactQuery(QueryKeys.userSocials(),
                  () => useGetUserByAddress((sessionData?.user as User)?.address),
      {enabled: !!(sessionData?.user as User)?.address, initialData: null})

  const {data: defaultAbout, refetch: refetchAbout} =
    useReactQuery(QueryKeys.about(), getUserAbout, {enabled: !!currentUser?.walletAddress})

  const {mutateAsync: saveSocials, isPending: isSocialPending} = useReactQueryMutation({
    mutationFn: onSaveSocials,
    toastError: t("social.error"),
    toastSuccess: t("social.success"),
    onSuccess: () => {
      refetchSocials();
    },
  });

  const {mutateAsync: saveAbout, isPending: isAboutPending} = useReactQueryMutation({
    mutationFn: onSaveSetAbout,
    toastError: t("social.about.saving.error"),
    toastSuccess: t("social.about.saving.success"),
    onSuccess: () => {
      refetchAbout();
    },
  });

  const { mutateAsync: saveFullName, isPending: isFullNamePending } = useReactQueryMutation({
    mutationFn: onSaveFullName,
    toastError: t("full-name-form.error"),
    toastSuccess: t("full-name-form.success"),
    onSuccess: () => {
      updateSession();
    },
  });

  const replacer = (value: string) => value?.replace(/https:\/\/(twitter|x|github|linkedin)\.com\/(in\/)?/, "")

  const isInputValid = (txt: string) => /^[a-zA-Z0-9_]*$/.test(txt);

  const isFormValid = () =>
    (about !== defaultAbout) ||
    (
      (replacer(socials?.githubLink) !== github || replacer(socials?.linkedInLink) !== linkedin || replacer(socials?.twitterLink) !== xcom) &&
      (github && isInputValid(github) || true) &&
      (linkedin && isInputValid(linkedin) || true) &&
      (xcom && isInputValid(xcom) || true)
    ) ||
    fullName !== currentUser?.fullName &&
    (!isSocialPending || !isAboutPending || !isFullNamePending);

  const onSocialChange = (value: string, label: string) => {
    if (label === "github")
      setGithub(value)
    if (label === "linkedin")
      setLinkedIn(value)
    if (label === "xcom")
      setXCom(value)
  }

  const onSubmit = () => {
    if (replacer(socials?.githubLink) !== github || replacer(socials?.linkedInLink) !== linkedin || replacer(socials?.twitterLink) !== xcom)
      saveSocials(null);
    if (about !== defaultAbout)
      saveAbout(null);
    if (fullName !== currentUser?.fullName)
      saveFullName(null);
  }

  useEffect(() => {
    if (!currentUser)
      return;

    refetchSocials();
    refetchAbout();
  }, [currentUser]);

  useEffect(() => {
    if (!socials)
      return;

    setGithub(replacer(socials.githubLink));
    setXCom(replacer(socials.twitterLink));
    setLinkedIn(replacer(socials.linkedInLink));
  }, [socials]);

  useEffect(() => {
    if (!defaultAbout)
      return;
    setAbout(defaultAbout)
  }, [defaultAbout]);

  useEffect(() => {
    if (!currentUser?.fullName)
      return;
    setFullName(currentUser?.fullName);
  }, [currentUser?.fullName]);

  return <>
    <FullNameForm
      value={fullName}
      onChange={e => setFullName(e.target.value)}
    />

    <AboutFormView 
      isBodyOverLimit={about.length > 512}
      body={about}
      defaultValue={defaultAbout}
      onChange={(e) => setAbout(e.target.value)}
      isSaving={isAboutPending}
    />

    <SocialFormView
      githubLink={replacer(socials?.githubLink) || ""}
      linkedInLink={replacer(socials?.linkedInLink) || ""}
      twitterLink={replacer(socials?.twitterLink) || ""}
      ghLink={github} liLink={linkedin} twitter={xcom}
      onChange={onSocialChange}
    />

    <div className="row mt-3">
      <div className="col">
        <Button onClick={() => onSubmit()} disabled={!isFormValid()} isLoading={isSocialPending || isAboutPending || isFullNamePending}>
          <span>{t("common:save")}</span>
        </Button>
      </div>
    </div>

    <div className="py-3">
      <Divider bg="gray-850" />
    </div>
  </>
}