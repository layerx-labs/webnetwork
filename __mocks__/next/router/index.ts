const mockPush = jest.fn();
const mockReplace = jest.fn();
const useRouter = jest.fn(() => ({
  query: {},
  pathname: "",
  asPath: "",
  events: { on: (event, callback) => callback(), off: jest.fn() },
  push: mockPush,
  replace: mockReplace,
}))

export {
  useRouter,
  mockPush,
  mockReplace,
}