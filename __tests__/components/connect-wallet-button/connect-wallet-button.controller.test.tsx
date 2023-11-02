import '@testing-library/jest-dom';

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";

import { changeShowWeb3 } from 'contexts/reducers/update-show-prop';

import ethereum from "__mocks__/ethereum";

import i18NextProviderTests from '__tests__/utils/i18next-provider';

const defaultAddress = "0x000000";

const state = {
  Service: {
    active: jest.fn()
  },
  currentUser: {
    walletAddress: null
  }
};

const mockedDispatch = jest.fn();

jest.mock("contexts/app-state", () => ({
  useAppState: () => ({
    dispatch: mockedDispatch,
    state
  })
}));

const mockedSignInWallet = jest.fn(() => {
  state.currentUser.walletAddress = defaultAddress;
});

jest.mock("x-hooks/use-authentication", () => ({
  useAuthentication: () => ({ 
    signInWallet: mockedSignInWallet
  })
}));

describe("ConnectWalletButton", () => {
  beforeEach(() => {
    window.ethereum = ethereum as any;
    state.currentUser.walletAddress = null;
    jest.clearAllMocks();
  });

  it("Should render children if connect succeeds", async () => {
    const result = render(<ConnectWalletButton>
      <span data-testid="address">{defaultAddress}</span>
      </ConnectWalletButton>, {
      wrapper: i18NextProviderTests
      });

    await userEvent.click(result.getByRole("button"));

    result.rerender(<ConnectWalletButton>
      <span data-testid="address">{defaultAddress}</span>
      </ConnectWalletButton>);

    expect(result.queryByRole("button")).toBeNull();
    expect(result.getByTestId("address").textContent).toBe(defaultAddress);
  });

  it("Should call useAuthentication().signInWallet if forceLogin is true", async () => {
    render(<ConnectWalletButton forceLogin={true}></ConnectWalletButton>, {
      wrapper: i18NextProviderTests
    });

    expect(mockedSignInWallet).toHaveBeenCalled();
  });

  it("Should not call useAuthentication().signInWallet if ethereum is not available", async () => {
    window.ethereum = null;

    const result = render(<ConnectWalletButton></ConnectWalletButton>, {
      wrapper: i18NextProviderTests
    });

    await userEvent.click(result.getByRole("button"));

    expect(mockedSignInWallet).not.toHaveBeenCalled();
  });

  it("Should change NoMetamaskModal visibility if ethereum is not available", async () => {
    window.ethereum = null;
    
    const result = render(<ConnectWalletButton></ConnectWalletButton>, {
      wrapper: i18NextProviderTests
    });

    await userEvent.click(result.getByRole("button"));

    expect(mockedDispatch).toHaveBeenCalledWith(changeShowWeb3(true));
  });
});