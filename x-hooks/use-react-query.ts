import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useReactQuery<T>(key: (string | number)[], getFn: () => Promise<T>, enabled = true) {
  const query = useQuery({
    queryKey: key, 
    queryFn: getFn,
    enabled
  });
  const queryClient = useQueryClient();

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: key });
  }

  return {
    ...query,
    invalidate
  };
}