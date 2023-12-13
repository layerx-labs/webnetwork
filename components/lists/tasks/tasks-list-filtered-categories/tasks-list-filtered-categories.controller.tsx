import { useRouter } from "next/router";

import CloseIcon from "assets/icons/close-icon";

import Button from "components/button";

import useQueryFilter from "x-hooks/use-query-filter";

export default function TasksListFilteredCategories () {
  const { query } = useRouter();

  const { setValue } = useQueryFilter({ categories: query?.categories });

  const categories = query?.categories?.toString().split(",").filter(c => c);

  function onClick (category: string) {
    return () => {
      const newCategories = query?.categories?.toString()?.replace(category, "")?.split(",")?.filter(c => c)?.join(",");
      setValue({ categories: newCategories }, true);
    };
  }

  if (!categories?.length)
    return <></>;

  return(
    <div className="row mb-4 pb-2 gx-3 gy-3">
      {categories?.map(c =>
        <div className="col-auto">
          <Button
            color="gray-850"
            className="border-gray-500 text-gray-400 font-weight-normal py-2 px-3"
            onClick={onClick(c)}
          >
            <span>{c}</span>
            <CloseIcon />
          </Button>
        </div>)}
    </div>
  );
}