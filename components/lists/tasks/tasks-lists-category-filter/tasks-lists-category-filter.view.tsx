import { useTranslation } from "next-i18next";
import Link from "next/link";

import { Category } from "components/lists/tasks/tasks-lists-category-filter/tasks-lists-category-filter.controller";

import CategoryButton from "./category-button/category.view";
interface TasksListsCategoryFilterViewProps {
  categories: Category[]
  onCategoryClick: (category: string) => void;
}
export default function TasksListsCategoryFilterView ({
  categories,
  onCategoryClick
}: TasksListsCategoryFilterViewProps) {
  const { t } = useTranslation("bounty");

  return(
    <div className="row mb-5">
      <div className="col">
        <div className="row mb-5">
          <span className="xl-semibold font-weight-medium text-white">
            {t("browse-by-category")}
          </span>
          <div className="mt-2 sm-regular text-white">
            <span className="mr-1">
              {t("want-to-launch-a-task")}
            </span>
            <Link href={"/create-task"}>
              <span
                  className="text-blue-400 text-decoration-underline cursor-pointer font-weight-medium"
                  data-testid="first-task-link"
                >
                  {t("create-your-first-task")}
              </span>
            </Link>
          </div>
        </div>

        <div className="row gy-3 gx-3">
          {categories.map(c =>
            <div className="col-6 col-lg" key={c.label}>
              <div className="row mx-0 h-100">
                <CategoryButton
                  category={c}
                  icon
                  onCategoryClick={onCategoryClick}
                />
              </div>
            </div>)}
        </div>
      </div>
    </div>
  );
}