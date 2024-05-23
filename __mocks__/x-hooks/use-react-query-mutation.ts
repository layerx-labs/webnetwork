import { mockAddError, mockAddSuccess } from "__mocks__/x-hooks/stores/toasts/toasts.store";

const useReactQueryMutation = jest.fn(({
  mutationFn,
  onSuccess = () => {},
  onError  = () => {},
  onSettled  = () => {},
  toastSuccess = undefined,
  toastError = undefined,
}) => {
  const mutate = jest.fn((props) => {
    try {
      mutationFn(props);
      onSuccess();
      onSettled();
      
      if (toastSuccess) 
        mockAddSuccess(toastSuccess);
    } catch(error) {
      onError();
      
      if (toastError)
        mockAddError(toastError);
    }
  });

  return {
    mutate: mutate,
    mutateAsync: mutate,
    onSuccess: onSuccess,
    onError,
    isPending: false
  };
});

export default useReactQueryMutation;