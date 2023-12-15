const useRouter = jest.fn(() => ({
  query: {},
  pathname: "",
  asPath: "",
  events: { on: (event, callback) => callback(), off: jest.fn() },
  push: jest.fn()
}))

export {
  useRouter
}