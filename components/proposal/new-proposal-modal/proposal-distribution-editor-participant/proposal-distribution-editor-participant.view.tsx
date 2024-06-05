import { NumberFormatValues } from "react-number-format";

import { useTranslation } from "next-i18next";

import TrashIcon from "assets/icons/trash-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import InputNumber from "components/input-number";

import { getUserLabel } from "helpers/user";

import { User } from "interfaces/api";

interface ProposalDistributionEditorParticipantViewProps {
  user: User;
  label: string;
  value: number;
  isDisabled?: boolean;
  isRemovable?: boolean;
  onBlur: () => void;
  onValueChange: (values: NumberFormatValues) => void;
  onRemoveParticipant: (user: User) => void;
}

export default function ProposalDistributionEditorParticipantView({
  user,
  label,
  value,
  isDisabled,
  isRemovable,
  onBlur,
  onValueChange,
  onRemoveParticipant,
}: ProposalDistributionEditorParticipantViewProps) {
  const { t } = useTranslation("proposal");

  const userLabel = getUserLabel(user);

  return (
    <div className="row align-items-center justify-content-between bg-gray-850 w-100 py-2" key={userLabel}>
      <div className="col gap-1">
        <div className="d-flex align-items-center gap-2">
          <AvatarOrIdenticon
            user={user}
            size="xsm"
          />

          <span className="xs-small text-gray-100 mt-1">
            {userLabel}
          </span>
        </div>

        <span className="xs-small text-gray-500 text-uppercase">
          {label}
        </span>
      </div>

      <div className="col">
        <div className="row align-items-center justify-content-end">
          <div className="col-5">
            <InputNumber
              value={value}
              suffix="%"
              onValueChange={onValueChange}
              onBlur={onBlur}
              className="text-center"
              disabled={isDisabled}
              placeholder="0%"
              allowNegative={false}
              decimalScale={0}
            />
          </div>

          <div className="col-auto px-0">
            <Tooltip tip={t("actions.remove-participant")}>
              <div>
                <Button
                  onClick={() => onRemoveParticipant(user)}
                  color="gray-800"
                  textClass="text-gray-50"
                  className="border-radius-4 p-1 border-gray-700 not-svg"
                  data-testid="copy-button"
                  disabled={!isRemovable}
                >
                  <TrashIcon width={16} height={16} />
                </Button>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
