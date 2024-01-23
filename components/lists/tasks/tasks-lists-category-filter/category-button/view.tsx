import BracketsCurlyIcon from "assets/icons/brackets-curly-icon";
import MegaPhoneIcon from "assets/icons/mega-phone-icon";
import PaletteIcon from "assets/icons/palette-icon";
import PencilLineIcon from "assets/icons/pencil-line-icon";

import Button from "components/button";
import If from "components/If";

import { Category } from "../tasks-lists-category-filter.controller";

export default function CategoryButton({
  category,
  onCategoryClick,
  icon = true,
}: {
  category: Category;
  icon: boolean;
  onCategoryClick: (category: string) => void;
}) {
  const { color, value, label } = category;

  function handleIcons(value: "code" | "design" | "marketing" | "writing") {
    const size = { width: "100%", height: "100%" };
    const icons = {
      code: <BracketsCurlyIcon style={size} />,
      design: <PaletteIcon style={size} />,
      marketing: <MegaPhoneIcon style={size} />,
      writing: <PencilLineIcon style={size} />,
    };

    return icons[value] || <BracketsCurlyIcon />;
  }

  return (
    <Button
      className={`category-filter-${color} 
           border-none text-capitalize lg-medium border-radius-16
          ${
            icon
              ? "justify-content-between ps-3 pe-0 pb-2 pt-0"
              : "px-3 pb-3 pt-5"
          }`}
      align="left"
      onClick={() => onCategoryClick(value)}
      style={{ maxHeight: '85px'}}
      data-testid={`category${icon ? '-': '-mobile-'}button-${value}`}
    >
      <If condition={icon} otherwise={(label)}>
        <div className="d-flex flex-column justify-content-end h-100 mb-1">
          <span>{label}</span>
        </div>
      </If>

      <If condition={icon}>{handleIcons(value)}</If>
    </Button>
  );
}
