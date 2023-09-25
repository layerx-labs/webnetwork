import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";

import { useAppState } from "contexts/app-state";
import { toastError, toastSuccess } from "contexts/reducers/change-toaster";

interface UseReactQueryMutationOptions {
  queryKey?: (string | number)[];
  toastSuccess?: string;
  toastError?: string;
}

export default function useReactQueryMutation<TData, TError, TVariables, TContext>({ 
  queryKey, 
  ...rest
}: UseReactQueryMutationOptions & UseMutationOptions<TData, TError, TVariables, TContext>) {
  const { dispatch } = useAppState();
  const queryClient = useQueryClient();

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: queryKey });
  }
  
  function onSuccess(data: TData, variables: TVariables, context: TContext) {
    rest?.onSuccess?.(data, variables, context);
    if (rest?.toastSuccess) dispatch(toastSuccess(rest?.toastSuccess));
    if (queryKey) invalidate();
  }

  function onError(error: TError, variables: TVariables, context: TContext) {
    rest?.onError?.(error, variables, context);
    if (rest?.toastError) dispatch(toastError(rest?.toastError));
    console.debug("useReactQueryMutation", queryKey, error);
  }

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    ...rest,
    onSuccess: onSuccess,
    onError: onError
  });

  return mutation;
}