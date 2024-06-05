import {useEffect, useState} from "react";
import {NumberFormatValues} from "react-number-format";

import TrashIcon from "assets/icons/trash-icon";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import InputNumber from "components/input-number";

import { truncateAddress } from "helpers/truncate-address";

import { User } from "interfaces/api";

interface Props {
  user: User;
  label: string;
  defaultValue?: number;
  isDisable?: boolean;
  isRemovable?: boolean;
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  onChangeDistribution(user: User, percentage: number): void;
  onRemoveParticipant: (user: User) => void;
}

export default function ProposalDistributionEditorParticipant({
  user,
  label,
  defaultValue,
  isDisable = false,
  isRemovable,
  onChangeDistribution,
  onRemoveParticipant,
  ...params
}: Props) {
  const [value, setValue] = useState<number>(defaultValue);

  const userLabel = user?.handle ? `@${user?.handle}` : truncateAddress(user?.address);

  function handleValueChange(params: NumberFormatValues) {
    setValue(params.floatValue);
    onChangeDistribution(user, params.floatValue);
  }
  // Wasted logic.
  // todo: move within InputNumber itself.
  function handleBlur() {
    let enhancedValue = value;
    if (value > 100) {
      enhancedValue = 100;
    }
    if (!value || value < 0) {
      enhancedValue = undefined;
    }

    setValue(enhancedValue);
    onChangeDistribution(user, enhancedValue);
  }

  useEffect(() => {
    if (defaultValue !== value)
      setValue(defaultValue);
  }, [defaultValue]);

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
              onValueChange={handleValueChange}
              onBlur={handleBlur}
              className="text-center"
              disabled={isDisable}
              placeholder="0%"
              allowNegative={false}
              decimalScale={0}
              {...params}
            />
          </div>

          <div className="col-auto px-0">
            <Tooltip tip={"Remove participant"}>
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
