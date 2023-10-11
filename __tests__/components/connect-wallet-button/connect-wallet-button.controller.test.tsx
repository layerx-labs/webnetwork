import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from 'jest.i18next.mjs';

import ConnectWalletButton from "components/connections/connect-wallet-button/connect-wallet-button.controller";

import ethereum from "__mocks__/ethereum";

const defaultAddress = "0x000000";

const state = {
  currentUser: {
    walletAddress: null
  }
};

jest.mock("contexts/app-state", () => ({
  useAppState: () => ({
    dispatch: () => {},
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
  });

  it("Should render children if connect succeeds", async () => {
    const { rerender } = render(<I18nextProvider i18n={i18n}>
      <ConnectWalletButton><span data-testid="address">{defaultAddress}</span></ConnectWalletButton>
      </I18nextProvider>);

    await userEvent.click(screen.getByRole("button"));

    rerender(<I18nextProvider i18n={i18n}>
      <ConnectWalletButton><span data-testid="address">{defaultAddress}</span></ConnectWalletButton>
      </I18nextProvider>);

    expect(screen.getByTestId("address").textContent).toBe(defaultAddress);
  });
});