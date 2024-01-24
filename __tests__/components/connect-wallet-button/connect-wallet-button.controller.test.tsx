import '@testing-library/jest-dom';

import userEvent from "@testing-library/user-event";

import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";

import ethereum from "__mocks__/ethereum";

import { render } from "__tests__/utils/custom-render";

const defaultAddress = "0x000000";

const currentUser = {
  walletAddress: null
};

const useLoadersStore = {
  updateWeb3Dialog: jest.fn(),
  updateWalletSelectorModal: jest.fn(),
};

jest.mock("x-hooks/stores/loaders/loaders.store", () => ({
  useLoadersStore: () => useLoadersStore
}));

jest.mock("x-hooks/stores/dao/dao.store", () => ({
  useDaoStore: () => ({
    service: jest.fn()
  })
}));

jest.mock("x-hooks/stores/user/user.store", () => ({
  useUserStore: () => ({
    currentUser
  })
}));

describe("ConnectWalletButton", () => {
  beforeEach(() => {
    window.ethereum = ethereum as any;
    currentUser.walletAddress = null;
    jest.clearAllMocks();
  });

  it("Should render button if wallet is not connected", async () => {
    const result = render(<ConnectWalletButton>
      <span data-testid="address">{defaultAddress}</span>
      </ConnectWalletButton>);

    expect(result.queryByRole("button")).toBeDefined();
    expect(result.queryByTestId("address")).toBeNull();
  });

  it("Should render children if wallet is connected", async () => {
    currentUser.walletAddress = defaultAddress;
    const result = render(<ConnectWalletButton>
      <span data-testid="address">{defaultAddress}</span>
    </ConnectWalletButton>);

    expect(result.queryByRole("button")).toBeNull();
    expect(result.getByTestId("address").textContent).toBe(defaultAddress);
  });

  it("Should change WalletSelectorModal visibility if ethereum is available", async () => {
    const result = render(<ConnectWalletButton></ConnectWalletButton>);

    await userEvent.click(result.getByRole("button"));

    expect(useLoadersStore.updateWalletSelectorModal).toHaveBeenCalledWith(true);
  });

  it("Should change NoWalletModal visibility if ethereum is not available", async () => {
    window.ethereum = null;
    
    const result = render(<ConnectWalletButton></ConnectWalletButton>);

    await userEvent.click(result.getByRole("button"));

    expect(useLoadersStore.updateWeb3Dialog).toHaveBeenCalledWith(true);
    expect(useLoadersStore.updateWalletSelectorModal).not.toHaveBeenCalled();
  });
});