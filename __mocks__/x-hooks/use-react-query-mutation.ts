export default function useReactQueryMutation({
    mutationFn,
    onSuccess = () => {},
    onError  = () => {}
  }) {
  const mutate = jest.fn((props) => {
    mutationFn(props);
    onSuccess();
  });
  return {
      mutate: mutate,
      mutateAsync: mutate,
      onSuccess: onSuccess,
      onError
  };
}