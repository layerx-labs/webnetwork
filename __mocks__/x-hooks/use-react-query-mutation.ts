import { mockAddSuccess } from "__mocks__/x-hooks/stores/toasts/toasts.store";

export default function useReactQueryMutation({
  mutationFn,
  onSuccess = () => {},
  onError  = () => {},
  toastSuccess = undefined,
  toastError = undefined,
}) {
  const mutate = jest.fn((props) => {
    mutationFn(props);
    onSuccess();
    if (toastSuccess) mockAddSuccess(toastSuccess);
  });
  return {
    mutate: mutate,
    mutateAsync: mutate,
    onSuccess: onSuccess,
    onError
  };
}