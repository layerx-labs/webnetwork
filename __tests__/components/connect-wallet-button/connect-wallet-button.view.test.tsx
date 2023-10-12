import "@testing-library/jest-dom";

import { render } from "@testing-library/react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import i18NextProviderTests from '__tests__/utils/i18next-provider';

describe("ConnectWalletButtonView", () => {
  const defaultProps = {
    asModal: false,
    isLoading: false,
    isModalVisible: false,
    hasWeb3Connection: false,
    isConnected: false,
    buttonColor: "white",
    onConnectClick: jest.fn()
  };

  it("Should render button if wallet is not connected", () => {
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    const button = result.queryByRole("button");
    console.log(button.textContent)
    expect(button).toBeVisible();
  });
});