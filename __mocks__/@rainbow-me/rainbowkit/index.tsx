export const openConnectModalMock = jest.fn(() => console.log("openConnectModalMock cliked"));
export const useConnectModal = jest.fn(() => ({
  openConnectModal: openConnectModalMock
}));