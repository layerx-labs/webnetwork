import '@testing-library/jest-dom';

import userEvent from "@testing-library/user-event";

import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";

import ethereum from "__mocks__/ethereum";

import { render } from "__tests__/utils/custom-render";

const defaultAddress = "0x000000";

const currentUser = {
  walletAddress: null
}

const useLoadersStore = {
  updateWeb3Dialog: jest.fn()
}

jest.mock("x-hooks/stores/loaders/loaders.store", () => ({
  useLoadersStore: () => useLoadersStore
}));

jest.mock("x-hooks/stores/dao/dao.store", () => ({
  useDaoStore: () => ({
    service: jest.fn()
  })
}))

jest.mock("x-hooks/stores/user/user.store", () => ({
  useUserStore: () => ({
    currentUser
  })
}))

const mockedSignInWallet = jest.fn(() => {
  currentUser.walletAddress = defaultAddress;
});

jest.mock("x-hooks/use-authentication", () => ({
  useAuthentication: () => ({ 
    signInWallet: mockedSignInWallet
  })
}));

describe("ConnectWalletButton", () => {
  beforeEach(() => {
    window.ethereum = ethereum as any;
    currentUser.walletAddress = null;
    jest.clearAllMocks();
  });

  it("Should render children if connect succeeds", async () => {
    const result = render(<ConnectWalletButton>
      <span data-testid="address">{defaultAddress}</span>
      </ConnectWalletButton>);

    await userEvent.click(result.getByRole("button"));

    result.rerender(<ConnectWalletButton>
      <span data-testid="address">{defaultAddress}</span>
      </ConnectWalletButton>);

    expect(result.queryByRole("button")).toBeNull();
    expect(result.getByTestId("address").textContent).toBe(defaultAddress);
  });

  it("Should call useAuthentication().signInWallet if forceLogin is true", async () => {
    render(<ConnectWalletButton forceLogin={true}></ConnectWalletButton>);

    expect(mockedSignInWallet).toHaveBeenCalled();
  });

  it("Should not call useAuthentication().signInWallet if ethereum is not available", async () => {
    window.ethereum = null;

    const result = render(<ConnectWalletButton></ConnectWalletButton>);

    await userEvent.click(result.getByRole("button"));

    expect(mockedSignInWallet).not.toHaveBeenCalled();
  });

  it("Should change NoMetamaskModal visibility if ethereum is not available", async () => {
    window.ethereum = null;
    
    const result = render(<ConnectWalletButton></ConnectWalletButton>);

    await userEvent.click(result.getByRole("button"));

    expect(useLoadersStore.updateWeb3Dialog).toHaveBeenCalledWith(true);
  });
});