import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import {ContextualSpan} from "components/contextual-span";

interface CallToActionProps {
  call: string;
  action: string;
  onClick: () => void;
  color: "success" | "danger" | "warning" | "info" | "primary";
  disabled?: boolean;
  executing?: boolean;
  isContractAction?: boolean;
  variant?: "network" | "registry"
}
export function CallToAction({
  call,
  action,
  onClick,
  color,
  disabled,
  executing,
  isContractAction = false,
  variant = "network"
}: CallToActionProps) {
  const BtnComponent = isContractAction ? ContractButton : Button;

  return(
    <ContextualSpan
      context={color}
      className="mb-3"
      classNameChildren="d-flex align-items-center"
      isAlert
    >
        <span className="mr-3">{call}</span>

        <BtnComponent
          color={color}
          disabled={executing || disabled}
          withLockIcon={disabled && !executing}
          isLoading={executing}
          onClick={onClick}
          variant={variant}
        >
          <span>{action}</span>
        </BtnComponent>
    </ContextualSpan>
  );
}