import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";

import { useAppState } from "contexts/app-state";
import { toastError, toastSuccess } from "contexts/reducers/change-toaster";

interface UseReactQueryMutationOptions<T> extends UseMutationOptions<T> {
  queryKey?: (string | number)[];
  toastSuccess?: string;
  toastError?: string;
}

export default function useReactQueryMutation<T>({ queryKey, ...rest }: UseReactQueryMutationOptions<T>) {
  const { dispatch } = useAppState();
  const queryClient = useQueryClient();

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: queryKey });
  }
  
  function onSuccess(data: T, variables: void, context: unknown) {
    rest?.onSuccess?.(data, variables, context);
    if (rest?.toastSuccess) dispatch(toastSuccess(rest?.toastSuccess));
    if (queryKey) invalidate();
  }

  function onError(error: unknown, variables: void, context: unknown) {
    rest?.onError?.(error, variables, context);
    if (rest?.toastError) dispatch(toastError(rest?.toastError));
    console.debug("useReactQueryMutation", queryKey, error);
  }

  const mutation = useMutation({
    ...rest,
    onSuccess: onSuccess,
    onError: onError
  });

  return mutation;
}