import { useTranslation } from "next-i18next";

import CloseIcon from "assets/icons/close-icon";

import Button from "components/button";

interface TasksListFilteredCategoriesViewProps {
  categories: string[];
  onClick: (category: string) => void;
}
export default function TasksListFilteredCategoriesView ({
  categories,
  onClick
}: TasksListFilteredCategoriesViewProps) {
  const { t } = useTranslation("bounty");

  if (!categories?.length)
    return <></>;

  return(
    <div className="row mb-4 pb-2 gx-3 gy-3" data-testid="categories-container">
      {categories?.map(c =>
        <div className="col-auto" key={c}>
          <Button
            color="gray-850"
            className="border-gray-500 text-gray-400 font-weight-normal py-2 px-3"
            onClick={() => onClick(c)}
            data-testid={`category-button-${c}`}
          >
            <span>{t(`categories.${c}`)}</span>
            <CloseIcon />
          </Button>
        </div>)}
    </div>
  );
}