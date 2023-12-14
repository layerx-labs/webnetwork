import { useRouter } from "next/router";

import TasksListFilteredCategoriesView
  from "components/lists/tasks/tasks-list-filtered-categories/tasks-list-filtered-categories.view";

import useQueryFilter from "x-hooks/use-query-filter";

export default function TasksListFilteredCategories () {
  const { query } = useRouter();

  const { setValue } = useQueryFilter({ categories: query?.categories });

  const categories = query?.categories?.toString().split(",").filter(c => c);

  function onClick (category: string) {
    const newCategories = query?.categories?.toString()?.replace(category, "")?.split(",")?.filter(c => c)?.join(",");
    setValue({ categories: newCategories }, true);
  }

  return(
    <TasksListFilteredCategoriesView
      categories={categories}
      onClick={onClick}
    />
  );
}