import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import TasksListsCategoryFilterView
  from "components/lists/tasks/tasks-lists-category-filter/tasks-lists-category-filter.view";

import useQueryFilter from "x-hooks/use-query-filter";

export interface Category {
  label: string;
  color: string;
  value: "code" | "design" | "marketing" | "writing";
}
export default function TasksListsCategoryFilter () {
  const { query } = useRouter();
  const { t } = useTranslation("bounty");

  const { setValue } = useQueryFilter({ categories: query?.categories });

  const categories: Category[] = [
    {
      label: t("categories.code"),
      color: "blue",
      value: "code"
    },
    {
      label: t("categories.design"),
      color: "orange",
      value: "design"
    },
    {
      label: t("categories.marketing"),
      color: "green",
      value: "marketing"
    },
    {
      label: t("categories.writing"),
      color: "pink",
      value: "writing"
    }
  ];

  function onCategoryClick (category: string) {
    const categories = query?.categories;
    const alreadySelected = categories?.includes(category);
    if (alreadySelected)
      return;
    const newCategories = [categories?.toString()?.split(","), category].filter(c => c);
    setValue({ categories: newCategories.join(","), page: "1" }, true);
  }

  return(
    <TasksListsCategoryFilterView
      categories={categories}
      onCategoryClick={onCategoryClick}
    />
  );
}