const mockAddSuccess = jest.fn();
const mockAddError = jest.fn();
const useToastStore = jest.fn(() => ({
  addSuccess: mockAddSuccess,
  addError: mockAddError,
}));

export {
  useToastStore,
  mockAddSuccess,
  mockAddError,
}