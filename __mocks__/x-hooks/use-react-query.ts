export const mockInvalidate = jest.fn();

export default function useReactQuery(key: (string | number)[], getFn: () => any) {
  return {
    data: getFn(),
    queryKey: key,
    queryFn: getFn,
    retry: false,
    invalidate: mockInvalidate,
  };
}
