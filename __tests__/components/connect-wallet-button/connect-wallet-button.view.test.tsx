import "@testing-library/jest-dom";

import { render } from "@testing-library/react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import i18NextProviderTests from '__tests__/utils/i18next-provider';

import "../styles/styles.scss";

describe("ConnectWalletButtonView", () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      asModal: false,
      isLoading: false,
      isModalVisible: false,
      hasWeb3Connection: false,
      isConnected: false,
      buttonColor: "white",
      onConnectClick: jest.fn()
    };
  });

  it("Should render button if wallet is not connected", () => {
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                            <span data-testid="address">address</span>
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    expect(result.queryByRole("button")).toBeVisible();
    expect(result.queryByTestId("address")).toBeNull();
  });

  it("Should render children if wallet is connected", () => {
    defaultProps.isConnected = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                            <span data-testid="address">address</span>
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    expect(result.queryByRole("button")).toBeNull();
    expect(result.queryByTestId("address").textContent).toBe("address");
  });

  it("Should render modal if asModal is true and isLoading is false", () => {
    defaultProps.asModal = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                            <span data-testid="address">address</span>
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
  });
});