import userEvent from "@testing-library/user-event";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";

import {changeShowWeb3} from "contexts/reducers/update-show-prop";

import {UNSUPPORTED_CHAIN} from "helpers/constants";

import ethereum from "__mocks__/ethereum";
import useBreakPointMocked from "__mocks__/x-hooks/use-breapoint";

import { render } from "__tests__/utils/custom-render";

jest.mock("next/config", () => () => ({
  publicRuntimeConfig: {}
}));

jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/"
  })
}));

const defaultAddress = "0x123456";
const defaultNetworkAddress = "0x123456";
const mockActiveMarketplace = {
  chain_id: 1,
  networkAddress: defaultNetworkAddress
};

const state = {
  Service: {
    active: jest.fn()
  },
  currentUser: {
    walletAddress: defaultAddress
  }
};

const mockedDispatch = jest.fn();

jest.mock("contexts/app-state", () => ({
  useAppState: () => ({
    dispatch: mockedDispatch,
    state
  })
}));

const mockStartService = jest.fn();
jest.mock("x-hooks/use-dao", () => ({
  useDao: () => ({
    start: mockStartService
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

jest.mock("x-hooks/use-dappkit", () => ({
  useDappkit: () => ({
    connection: {
      async getAddress () {
        return defaultAddress;
      }
    }
  })
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

jest.mock("x-hooks/use-breakpoint", () => ({
  __esModule: true,
  default: (prop) => useBreakPointMocked(prop)
}));

const mockOnClick = jest.fn();

describe("ContractButton", () => {
  beforeEach(() => {
    window.ethereum = ethereum as any;
    mockConnectedChain.id = 1;
    mockConnectedChain.name = "chain";
    state.currentUser.walletAddress = defaultAddress;
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

  it("Should not execute onClick because window.ethereum is not available", async () => {
    window.ethereum = null;
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalledWith(changeShowWeb3(true));
  });

  it("Should not execute onClick because connected chain doesn't match with marketplace chain", async () => {
    mockConnectedChain.id = 2;
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(result.getByRole("dialog").getAttribute("aria-labelledby")).toBe("change-network-modal");
  });

  it("Should not execute onClick because connected chain is not supported", async () => {
    mockConnectedChain.name = UNSUPPORTED_CHAIN;
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(result.getByRole("dialog").getAttribute("aria-labelledby")).toBe("change-network-modal");
  });

  it("Should not execute onClick because connected wallet is different of session wallet", async () => {
    state.currentUser.walletAddress = "0x000000";
    const result = render(<ContractButton onClick={mockOnClick}>
      <span data-testid="action">Make Transaction</span>
    </ContractButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(result.getByRole("dialog").getAttribute("aria-labelledby")).toBe("wallet-mismatch-modal");
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