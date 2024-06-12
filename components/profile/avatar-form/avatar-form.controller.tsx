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

import {countRequestSize} from "../../../helpers/count-request-size";
import {shrinkImage} from "../../../helpers/file-reader";

export function AvatarForm() {
  const { t } = useTranslation("common");
  const { update: updateSession } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarImage, setAvatarImage] = useState<ImageObject>();
  const [overLimit, setOverLimit] = useState<boolean>(false);

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
        addError(t("actions.failed"), error.response.data.toString());
    },
  });

  const _onChange = async (image: ImageObject) => {
    setOverLimit(false);

    const shrunk = await shrinkImage(image.raw);
    const count = countRequestSize({body: {file: shrunk}});

    if ((count > 1024) || !shrunk)
      setOverLimit(true);

    setAvatarImage({preview: shrunk, raw: image.raw});
  }

  const maxFileSize = 5;
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
      onSaveClick={() => handleSave({
        address: currentUser?.walletAddress,
        avatar: avatarImage?.preview,
      })}
      maxFileSize={maxFileSize}
      onCancelClick={handleCancel}
      onAvatarChange={_onChange}
      overLimit={overLimit}
    />
  );
}