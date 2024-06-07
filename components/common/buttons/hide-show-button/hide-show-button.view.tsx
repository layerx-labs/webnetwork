import EyeIcon from "assets/icons/eye-icon";
import EyeSlashIcon from "assets/icons/eye-slash-icon";

import Button from "components/button";
import { Tooltip } from "components/common/tooltip/tooltip.view";

interface HideShowButtonProps {
  isVisible: boolean;
  hideTip?: string;
  showTip?: string;
  onHideClick: () => void;
  onShowClick: () => void;
}

export function HideShowButton({
  isVisible,
  hideTip,
  showTip,
  onHideClick,
  onShowClick,
}: HideShowButtonProps) {
  const tip = isVisible ? hideTip || "Hide" : showTip || "Show";
  const icon = isVisible ? <EyeSlashIcon /> : <EyeIcon />;
  const onClick = isVisible ? onHideClick : onShowClick;

  return(
    <Tooltip tip={tip}>
      <div>
        <Button
          onClick={onClick}
          color="gray-800"
          textClass="text-gray-50"
          className="border-radius-4 p-0 border-gray-700 not-svg"
          data-testid="hide-show-button"
        >
          {icon}
        </Button>
      </div>
    </Tooltip>
  );
}