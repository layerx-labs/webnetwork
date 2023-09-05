import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useReactQuery<T>(key: (string | number)[], getFn: () => Promise<T>) {
  const query = useQuery({
    queryKey: key, 
    queryFn: getFn
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