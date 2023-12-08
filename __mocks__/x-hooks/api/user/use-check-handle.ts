const useCheckHandle = jest.fn(async (handle: string): Promise<boolean> => {
  return true;
});

export {
  useCheckHandle
};