import { useTranslation } from "next-i18next";
import Link from "next/link";

import Button from "components/button";
import { Category } from "components/lists/tasks/tasks-lists-category-filter/tasks-lists-category-filter.controller";

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
              <span className="text-blue-400 text-decoration-underline cursor-pointer font-weight-medium">
                {t("create-your-first-task")}
              </span>
            </Link>
          </div>
        </div>

        <div className="row gy-3 gx-3">
          {categories.map(c =>
            <div className="col-6 col-lg" key={c.label}>
              <div className="row mx-0">
                <Button
                  className={`category-filter-${c.color} border-none text-capitalize lg-medium border-radius-16 
                    px-3 pb-3 pt-5`}
                  align="left"
                  onClick={() => onCategoryClick(c.value)}
                  data-testid={`category-button-${c.value}`}
                >
                  {c.label}
                </Button>
              </div>
            </div>)}
        </div>
      </div>
    </div>
  );
}