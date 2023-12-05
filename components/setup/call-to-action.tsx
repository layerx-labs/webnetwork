import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import {ContextualSpan} from "components/contextual-span";

export function CallToAction({
  call,
  action,
  onClick,
  color,
  disabled,
  executing,
  isContractAction = false
}) {
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
        >
          <span>{action}</span>
        </BtnComponent>
    </ContextualSpan>
  );
}