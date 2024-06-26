import userEvent from "@testing-library/user-event";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";

import {UNSUPPORTED_CHAIN} from "helpers/constants";

import { openConnectModalMock } from "__mocks__/@rainbow-me/rainbowkit";
import ethereum from "__mocks__/ethereum";
import { addressMock, useAccount, useConnectors } from "__mocks__/wagmi";

import { render } from "__tests__/utils/custom-render";

jest.mock("next/config", () => () => ({
  publicRuntimeConfig: {}
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/"
  })
}));

const defaultNetworkAddress = "0x123456";
const mockActiveMarketplace = {
  chain_id: 1,
  networkAddress: defaultNetworkAddress
};

const currentUser = {
  walletAddress: addressMock
};

const useLoadersStore = {
  updateWrongNetworkModal: jest.fn(),
  updateWalletMismatchModal: jest.fn(),
};

const mockStartService = jest.fn();
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
jest.mock("x-hooks/use-dao", () => ({
  useDao: () => ({
    start: mockStartService,
    connect: mockConnect,
    disconnect: mockDisconnect,
  })
}));

jest.mock("x-hooks/use-marketplace", () => () => ({
  active: mockActiveMarketplace
}));

jest.mock("x-hooks/use-authentication", () => ({
  useAuthentication: () => ({
    signInWallet: jest.fn()
  })
}));

jest.mock("x-hooks/stores/user/user.store", () => ({
  useUserStore: () => ({
    currentUser
  })
}));

jest.mock("x-hooks/stores/loaders/loaders.store", () => ({
  useLoadersStore: () => useLoadersStore
}));

const mockConnectedChain = {
  id: 1,
  name: "chain"
};
jest.mock("x-hooks/use-supported-chain", () => () => ({
  supportedChains: [
    { chainId: 1, chainShortName: "chain" }
  ],
  connectedChain: mockConnectedChain
}));

const mockOnClick = jest.fn();

jest.mock("nookies", () => ({
  parseCookies: () => ({
    "wagmi.recentConnectorId": "defaultConnector"
  })
}))

describe("ContractButton", () => {
  beforeEach(() => {
    window.ethereum = ethereum as any;
    mockConnectedChain.id = 1;
    mockConnectedChain.name = "chain";
    currentUser.walletAddress = addressMock;
    jest.clearAllMocks();
  });

  it("Should execute onClick", async () => {
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it("Should start service with marketplace chain and address if is network variant", async () => {
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockStartService).toHaveBeenCalledWith({
      chainId: mockActiveMarketplace.chain_id,
      networkAddress: mockActiveMarketplace.networkAddress
    });
  });

  it("Should start service with connected chain and without network address if is registry variant", async () => {
    const result = render(<ContractButton onClick={mockOnClick} variant="registry">
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockStartService).toHaveBeenCalledWith({
      chainId: mockConnectedChain.id,
      networkAddress: null
    });
  });

  it("Should connect if session exists, wallet is not connected and is injected provider", async () => {
    useAccount
      .mockImplementationOnce(() => ({ address: null }));

    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockConnect).toHaveBeenCalled();
  });

  it(`Should disconnect and open connect modal if session exists, 
          wallet is not connected and is not injected provider`, async () => {
    useAccount
      .mockImplementationOnce(() => ({ address: null }));
    useConnectors
      .mockImplementationOnce(() => ([{ id: "defaultConnect", type: "walletConnect" }]));

    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalled();
    expect(openConnectModalMock).toHaveBeenCalled();
  });

  it("Should not execute onClick because connected chain doesn't match with marketplace chain", async () => {
    mockConnectedChain.id = 2;
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(useLoadersStore.updateWrongNetworkModal).toHaveBeenCalledWith(true);
  });

  it("Should not execute onClick because connected chain is not supported", async () => {
    mockConnectedChain.name = UNSUPPORTED_CHAIN;
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(useLoadersStore.updateWrongNetworkModal).toHaveBeenCalledWith(true);
  });

  it("Should not execute onClick because connected wallet is different of session wallet", async () => {
    currentUser.walletAddress = "0x000000";
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(useLoadersStore.updateWalletMismatchModal).toHaveBeenCalledWith(true);
  });

  it("Should not execute onClick because service failed to start", async () => {
    mockStartService
      .mockImplementation(async () => {
        throw new Error("Failed to start");
      });
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});