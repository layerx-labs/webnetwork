import { useTranslation } from "next-i18next";

import Button from "components/button";
import { AboutFormView } from "components/profile/about-form/about-form-view";
import { FullNameForm } from "components/profile/full-name-form/full-name-form.view";
import { SocialFormView } from "components/profile/socials-form/social-form-view";

type Social = {
  displayValue: string;
  value: string;
}

type AboutSocialViewProps = {
  about: string;
  defaultAbout: string;
  fullName: string;
  github: Social;
  linkedin: Social;
  twitter: Social;
  isAboutOverLimit: boolean;
  isSubmitting: boolean;
  isSubmitAble: boolean;
  onFullNameChange: (value: string) => void;
  onAboutChange: (value: string) => void;
  onSocialChange: (value: string, label: string) => void;
  onSubmit: () => void;
}

export function AboutSocialView({
  about,
  defaultAbout,
  fullName,
  github,
  linkedin,
  twitter,
  isAboutOverLimit,
  isSubmitting,
  isSubmitAble,
  onFullNameChange,
  onAboutChange,
  onSocialChange,
  onSubmit,
}: AboutSocialViewProps) {
  const { t } = useTranslation("profile");
  
  return <>
    <FullNameForm
      value={fullName}
      onChange={e => onFullNameChange(e.target.value)}
    />

    <AboutFormView
      isBodyOverLimit={isAboutOverLimit}
      body={about}
      defaultValue={defaultAbout}
      onChange={(e) => onAboutChange(e.target.value)}
      isSaving={isSubmitting}
    />

    <SocialFormView
      githubLink={github?.displayValue}
      linkedInLink={linkedin?.displayValue}
      twitterLink={twitter?.displayValue}
      ghLink={github?.value} 
      liLink={linkedin?.value} 
      twitter={twitter?.value}
      onChange={onSocialChange}
    />

    <div className="row mt-3">
      <div className="col">
        <Button 
          onClick={onSubmit} 
          disabled={!isSubmitAble} 
          isLoading={isSubmitting}
        >
          <span>{t("common:save")}</span>
        </Button>
      </div>
    </div>
  </>
}