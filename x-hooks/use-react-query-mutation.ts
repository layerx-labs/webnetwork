import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseReactQueryMutationOptions<T> {
  queryKey?: (string | number)[];
  mutationFn: (params) => Promise<T>;
  onSuccess?: (...params) => void;
  onError?: (...params) => void;
}

export default function useReactQueryMutation<T>({ queryKey, ...rest }: UseReactQueryMutationOptions<T>) {
  const queryClient = useQueryClient();

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: queryKey });
  }
  
  function onSuccess(params) {
    rest?.onSuccess?.(params);
    if (queryKey) invalidate();
  }

  const mutation = useMutation({
    ...rest,
    onSuccess: onSuccess
  });

  return mutation;
}