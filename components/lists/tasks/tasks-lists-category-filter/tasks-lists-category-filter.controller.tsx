import Link from "next/link";
import { useRouter } from "next/router";

import Button from "components/button";

import useQueryFilter from "x-hooks/use-query-filter";

export default function TasksListsCategoryFilter () {
  const { query } = useRouter();

  const { setValue } = useQueryFilter({ categories: query?.categories });

  const categories = [
    {
      label: "Technology",
      color: "blue",
      value: "code"
    },
    {
      label: "Creative",
      color: "orange",
      value: "design"
    },
    {
      label: "Marketing",
      color: "green",
      value: "marketing"
    },
    {
      label: "Writing",
      color: "pink",
      value: "writing"
    }
  ];

  function onCategoryClick (category: string) {
    return () => {
      const categories = query?.categories;
      const alreadySelected = categories?.includes(category);
      if (alreadySelected)
        return;
      const newCategories = [(query.categories || "").toString().split(","), category];
      setValue({ categories: newCategories.join(",") }, true);
    };
  }

  return(
    <div className="row mb-5">
      <div className="col">
        <div className="row mb-5">
          <span className="xl-semibold font-weight-medium text-white">
            Browse by category
          </span>
          <div className="mt-2 sm-regular text-white">
            <span className="mr-1">
              Want to launch a task?
            </span>
            <Link href={"/create-task"}>
              <span className="text-blue-400 text-decoration-underline cursor-pointer font-weight-medium">
                Create your first task
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
                  onClick={onCategoryClick(c.value)}
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