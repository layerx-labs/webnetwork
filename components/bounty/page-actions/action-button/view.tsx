import { ReactElement } from "react";

import Button from "components/button";
import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import GithubLink from "components/github-link";
import ReadOnlyButtonWrapper from "components/read-only-button-wrapper";

interface PageActionsButtonProps {
  children: ReactElement;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  buttonType?: "contract" | "github" | "normal";
  isLoading?: boolean;
  forcePath?: string;
  hrefPath?: string;
  dataTestId?: string;
}

export default function PageActionsButton({
  children,
  className,
  onClick,
  disabled,
  buttonType = "contract",
  isLoading,
  forcePath,
  dataTestId
}: PageActionsButtonProps) {
  if (buttonType === "contract") {
    return (
      <ReadOnlyButtonWrapper>
        <ContractButton
          color="primary"
          onClick={onClick}
          className={className}
          disabled={disabled}
          isLoading={isLoading}
          data-test-id={dataTestId}
        >
          {children}
        </ContractButton>
      </ReadOnlyButtonWrapper>
    );
  }

  if (buttonType === "github") {
    return (
      <GithubLink
        forcePath={forcePath}
        hrefPath="fork"
        className="btn btn-primary bounty-outline-button"
        data-test-id={dataTestId}
      >
        {children}
      </GithubLink>
    );
  }

  return (
    <Button onClick={onClick} className={className} data-test-id={dataTestId}>
      {children}
    </Button>
  );
}
