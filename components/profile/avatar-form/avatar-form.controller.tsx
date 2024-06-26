import {useState} from "react";

import {AxiosError} from "axios";
import {useSession} from "next-auth/react";
import {useTranslation} from "next-i18next";

import {AvatarFormView} from "components/profile/avatar-form/avatar-form.view";

import {ImageObject} from "types/components";

import {useUpdateUserAvatar} from "x-hooks/api/user/use-update-user-avatar";
import {useToastStore} from "x-hooks/stores/toasts/toasts.store";
import {useUserStore} from "x-hooks/stores/user/user.store";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export function AvatarForm() {
  const { t } = useTranslation("common");
  const { update: updateSession } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarImage, setAvatarImage] = useState<ImageObject>();

  const { addError } = useToastStore();
  const { currentUser } = useUserStore();

  const { mutate: handleSave, isPending: isSaving } = useReactQueryMutation({
    mutationFn: useUpdateUserAvatar,
    onSettled(data, error: AxiosError) {
      if (!error) {
        updateSession()
          .then(() => {
            setIsEditing(false);
            setAvatarImage(null);
          });
        return;
      }
      if (error.response.status === 413)
        addError(t("actions.failed"), t("errors.file-size-exceeded"));
      else
        addError(t("actions.failed"), (error.response.data as any).message);
    },
  });

  const saveAvatar = () => {
    const form = new FormData();
    form.append("file", avatarImage.raw);

    handleSave({form, address: currentUser?.walletAddress});
  }

  const maxFileSize = 10;
  const acceptedImageTypes = "image/png, image/jpeg, image/jpg";
  const isSaveButtonDisabled = !avatarImage || isSaving;

  const handleEditClick = () => setIsEditing(true);

  function handleCancel() {
    setIsEditing(false);
    setAvatarImage(null);
  }

  return(
    <AvatarFormView
      isEditing={isEditing}
      userAddress={currentUser?.walletAddress}
      avatarHash={currentUser?.avatar}
      avatarImage={avatarImage}
      acceptedImageTypes={acceptedImageTypes}
      isSaving={isSaving}
      isSaveButtonDisabled={isSaveButtonDisabled}
      onEditClick={handleEditClick}
      onSaveClick={saveAvatar}
      maxFileSize={maxFileSize}
      onCancelClick={handleCancel}
      onAvatarChange={setAvatarImage}
    />
  );
}