import { useEffect, useState } from "react";

import { useRouter } from "next/router";

export default function useQueryFilter(params: string[], defaultValue?: string) {
  const router = useRouter();

  const [value, setValue] = useState(Object.fromEntries(params.map(e => [e, null])));

  function updateRouter(newValue) {
    router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          ...newValue
        }
    }, router.asPath, { shallow: false, scroll: false });
  }

  function apply() {
    updateRouter(value);
  }

  function updateValue(newParams, autoApply?: boolean) {    
    if (autoApply)
      updateRouter({
        ...value,
        ...newParams,
      });
    else
      setValue(previous => ({
        ...previous,
        ...newParams,
      }));
  }

  useEffect(() => {
    if (!router?.query) {
      setValue(undefined);
      return;
    }

    const currentQueryValue = Object.fromEntries(params.map(p => [p, router.query[p]]));

    console.log("currentQueryValue", currentQueryValue)

    setValue(currentQueryValue);
  }, [router?.query]);

  return {
    value,
    setValue: updateValue,
    apply,
  }
}