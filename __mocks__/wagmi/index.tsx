export const addressMock = "0xf15CC0ccBdDA041e2508B829541917823222F364";
export const useAccount = jest.fn(() => ({
  address: addressMock
}));
export const useConnectors = jest.fn(() => ([
  {
    id: "defaultConnector",
    type: "injected"
  }
]));