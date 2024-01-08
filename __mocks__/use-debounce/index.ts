const useDebouncedCallback = jest.fn((callback, time) => {
  return callback;
});

const useDebounce = jest.fn((value, time) => ([value, jest.fn()]));

export {
  useDebouncedCallback,
  useDebounce
}