const events = {};

export default {
  isMetaMask: true,
  on() {},
  request: async (request: { method: string, params?: Array<unknown> }) => {
    switch (request.method) {
    case 'eth_accounts':
    case 'eth_requestAccounts':
      return [process.env.TEST_DEFAULT_WALLET];
    case 'personal_sign':
      return process.env.TEST_SIGNED_MESSAGE;
    case 'eth_chainId':
      return 1337;
    default:
      throw Error(`Unknown request: ${request.method}`)
    }
  }
}