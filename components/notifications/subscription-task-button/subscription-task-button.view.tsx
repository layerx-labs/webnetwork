import { MouseEvent } from "react";

import { useTranslation } from "next-i18next";

import BellIcon from "assets/icons/bell-icon";
import BellSlashIcon from "assets/icons/bell-slash-icon";

import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";
import If from "components/If";
import { ResponsiveEle } from "components/responsive-wrapper";

interface SubscriptionTaskButtonViewProps {
  isSubscribed: boolean;
  isDisabled: boolean;
  isConnected: boolean;
  variant?: "icon" | "text";
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function SubscriptionTaskButtonView({
  isSubscribed,
  isDisabled,
  isConnected,
  variant = "text",
  onClick,
}: SubscriptionTaskButtonViewProps) {
  const { t } = useTranslation("bounty");

  const isTextVariant = variant === "text";
  const icon = isSubscribed ? <BellSlashIcon height={18} width={18} /> : <BellIcon height={18} width={18} />;
  const text = isSubscribed ? t("actions.unsubscribe") : t("actions.subscribe");

  if (!isConnected)
    return <></>;

  return(
    <Tooltip tip={text}>
      <div>
        <Button
          onClick={onClick}
          disabled={isDisabled}
          color="gray-900"
          className="border-radius-4 py-1 px-2 border-gray-800 not-svg d-flex align-items-center font-weight-normal"
          transparent
        >
          <span className="d-block m-1">
            {icon}
          </span>

          <If condition={isTextVariant}>
            <ResponsiveEle
              tabletView={<span>{text}</span>}
            />
          </If>
        </Button>
      </div>
    </Tooltip>
  );
}