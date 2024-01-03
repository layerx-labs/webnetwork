import { mockAddSuccess } from "__mocks__/x-hooks/stores/toasts/toasts.store";

const useReactQueryMutation = jest.fn(({
  mutationFn,
  onSuccess = () => {},
  onError  = () => {},
  toastSuccess = undefined,
  toastError = undefined,
}) => {
  const mutate = jest.fn((props) => {
    mutationFn(props);
    onSuccess();
    if (toastSuccess) mockAddSuccess(toastSuccess);
  });
  return {
    mutate: mutate,
    mutateAsync: mutate,
    onSuccess: onSuccess,
    onError,
    isLoading: false
  };
});

export default useReactQueryMutation;