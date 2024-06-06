import { useTranslation } from "next-i18next";

import ProfileEditIcon from "assets/profile-edit-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";
import ImageUploader from "components/image-uploader";

import { ImageObject } from "types/components";

import useBreakPoint from "x-hooks/use-breakpoint";

type AvatarFormView = {
  isEditing: boolean;
  userAddress: string;
  avatarHash: string;
  avatarImage: ImageObject;
  acceptedImageTypes: string;
  isSaving: boolean;
  isSaveButtonDisabled: boolean;
  maxFileSize: number;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onAvatarChange: (avatar: ImageObject) => void;
}

export function AvatarFormView({
  isEditing,
  userAddress,
  avatarHash,
  avatarImage,
  acceptedImageTypes,
  isSaving,
  isSaveButtonDisabled,
  maxFileSize,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onAvatarChange,
}: AvatarFormView) {
  const { t } = useTranslation("common");

  const { isMobileView, isTabletView } = useBreakPoint();

  const isTabletOrMobile = isMobileView || isTabletView;

  return(
    <div className="d-flex align-items-end gap-2">
      <If condition={!isEditing}>
        <AvatarOrIdenticon
          user={{
            address: userAddress,
            avatar: avatarHash
          }}
          size={isTabletOrMobile ? "md" : "xl"}
          withBorder
        />

        <Button
          onClick={onEditClick}
          color="gray-900"
          textClass="text-gray-50"
          className="border-radius-8 p-1 not-svg"
          data-testid="user-edit-icon-btn"
        >
          <ProfileEditIcon />
        </Button>
      </If>

      <If condition={isEditing}>
        <div className="d-flex flex-column align-items-center gap-1">
          <ImageUploader
            name="Avatar"
            value={avatarImage}
            onChange={onAvatarChange}
            accept={acceptedImageTypes}
            circle
          />

          <span className="xs-small text-warning">{`${t("misc.up-to")} ${maxFileSize}MB`}</span>
        </div>

        <Button
          onClick={onSaveClick}
          disabled={isSaveButtonDisabled}
          isLoading={isSaving}
          data-testid="update-avatar-button"
        >
          {t("actions.save")}
        </Button>

        <Button
          color="gray-850"
          onClick={onCancelClick}
          disabled={isSaving}
          data-testid="cancel-avatar-button"
        >
          {t("actions.cancel")}
        </Button>
      </If>
    </div>
  );
}