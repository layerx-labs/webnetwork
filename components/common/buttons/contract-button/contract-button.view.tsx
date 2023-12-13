import Button from "components/button";
import type {ContractButtonProps} from "components/common/buttons/contract-button/contract-button.controller";

export default function ContractButtonView({
  children,
  ...rest
}: ContractButtonProps) {
  return(
    <Button
      {...rest}
    >
      {children}
    </Button>
  );
}