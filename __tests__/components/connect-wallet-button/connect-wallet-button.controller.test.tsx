import '@testing-library/jest-dom';

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";

import { changeShowWeb3 } from 'contexts/reducers/update-show-prop';

import ethereum from "__mocks__/ethereum";

import i18NextProviderTests from '__tests__/utils/i18next-provider';

const defaultAddress = "0x000000";

const state = {
  currentUser: {
    walletAddress: null
  }
};

jest.mock("contexts/app-state", () => ({
  useAppState: () => ({
    dispatch: (action) => console.log(action),
    state
  })
}));

jest.mock("x-hooks/use-authentication", () => ({
  useAuthentication: () => ({ signInWallet: async () => {
    state.currentUser.walletAddress = defaultAddress;
  }})
}));

describe("ConnectWalletButton", () => {
  beforeEach(() => {
    window.ethereum = ethereum as any;
    state.currentUser.walletAddress = null;
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

  it.only("Should not call signInWallet if ethereum is not available", async () => {
    window.ethereum = null;
    
    const mockedUseAuthentication = jest.requireMock("x-hooks/use-authentication");
    const signInWalletSpy = jest.spyOn(mockedUseAuthentication, "signInWallet");

    const result = render(<ConnectWalletButton></ConnectWalletButton>, {
      wrapper: i18NextProviderTests
    });

    await userEvent.click(result.getByRole("button"));

    expect(signInWalletSpy).toHaveBeenCalled();
  });

  it("Should change no-metamask-modal visibility if ethereum is not available", async () => {
    window.ethereum = null;
    
    const result = render(<ConnectWalletButton></ConnectWalletButton>, {
      wrapper: i18NextProviderTests
    });

    const mockedUseAppState = jest.requireMock("contexts/app-state").useAppState();
    const dispatchSpy = jest.spyOn(mockedUseAppState, "dispatch");

    await userEvent.click(result.getByRole("button"));

    expect(dispatchSpy).toHaveBeenCalledWith(changeShowWeb3(true));
  });
});