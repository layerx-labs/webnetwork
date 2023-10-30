import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";

import { useToastStore } from "x-hooks/stores/toasts/toasts.store";

interface UseReactQueryMutationOptions {
  queryKey?: (string | number)[];
  toastSuccess?: string;
  toastError?: string;
}

export default function useReactQueryMutation<TData, TError, TVariables, TContext>({ 
  queryKey, 
  ...rest
}: UseReactQueryMutationOptions & UseMutationOptions<TData, TError, TVariables, TContext>) {
  const queryClient = useQueryClient();
  const { addError, addSuccess } = useToastStore();

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: queryKey });
  }
  
  function onSuccess(data: TData, variables: TVariables, context: TContext) {
    rest?.onSuccess?.(data, variables, context);
    if (rest?.toastSuccess) addSuccess("", rest?.toastSuccess);
    if (queryKey) invalidate();
  }

  function onError(error: TError, variables: TVariables, context: TContext) {
    rest?.onError?.(error, variables, context);
    if (rest?.toastError) addError("", rest?.toastError);
    console.debug("useReactQueryMutation", queryKey, error);
  }

  const mutation = useMutation<TData, TError, TVariables, TContext>({
    ...rest,
    onSuccess: onSuccess,
    onError: onError
  });

  return mutation;
}