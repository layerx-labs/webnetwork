const mockAddSuccess = jest.fn();
const useToastStore = jest.fn(() => ({
  addSuccess: mockAddSuccess
}));

export {
  useToastStore,
  mockAddSuccess
}