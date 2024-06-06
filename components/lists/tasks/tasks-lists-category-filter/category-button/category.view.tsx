import LightningIcon from "assets/icons/lightning-icon";
import MegaPhoneIcon from "assets/icons/mega-phone-icon";
import PaletteIcon from "assets/icons/palette-icon";
import PencilLineIcon from "assets/icons/pencil-line-icon";

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
    const size = { width: 24, height: 24 };
    const icons = {
      code: <LightningIcon {...size} />,
      design: <PaletteIcon {...size} />,
      marketing: <MegaPhoneIcon {...size} />,
      writing: <PencilLineIcon {...size} />,
    };

    return icons[value] || <LightningIcon />;
  }

  return (
    <button
      className={`category-filter-wrapper category-filter-wrapper-${color}`}
      onClick={() => onCategoryClick(value)}
      data-testid={`category${icon ? '-': '-mobile-'}button-${value}`}
    >
      <div className={`category-filter-content category-filter-content-${color} d-flex 
        flex-column align-items-start h-100 p-3 gap-4`}>
        <If condition={icon}>
          {handleIcons(value)}
        </If>

        <If condition={icon} otherwise={(label)}>
          <div className="text-white font-weight-medium family-Inter">
            <span>{label}</span>
          </div>
        </If>
      </div>
    </button>
  );
}
