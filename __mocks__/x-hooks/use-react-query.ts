export const mockInvalidate = jest.fn();

export default function useReactQuery(key: (string | number)[],
                                      getFn: () => void) {
  const query = jest.fn(() => ({
    queryKey: key,
    queryFn: getFn,
    retry: false,
  }));
  

  return {
    ...query,
    invalidate: mockInvalidate,
  };
}
