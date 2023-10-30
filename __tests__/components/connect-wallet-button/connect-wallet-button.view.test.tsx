import "@testing-library/jest-dom";

import { render } from "@testing-library/react";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import useBreakPointMocked from "__mocks__/x-hooks/use-breapoint";

import i18NextProviderTests from '__tests__/utils/i18next-provider';

jest.mock("x-hooks/use-breakpoint", () => ({
  __esModule: true,
  default: (prop) => useBreakPointMocked(prop)
}));

describe("ConnectWalletButtonView", () => {
  let defaultProps;

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("Should render button with responsive labels", () => {
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    const button = result.queryByRole("button");
    const mobileLabel = button.firstChild.firstChild;
    const desktopLabel = button.firstChild.lastChild;
    expect(mobileLabel).toHaveClass("d-flex d-xl-none");
    expect(mobileLabel.textContent).toBe("Connect");
    expect(desktopLabel).toHaveClass("d-none d-xl-flex");
    expect(desktopLabel.textContent).toBe("Connect Wallet");
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

  it("Should render modal if is modal variant and wallet is not connected", () => {
    defaultProps.asModal = true;
    defaultProps.isModalVisible = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    expect(result.queryByTestId("connect-wallet-modal")).toBeVisible();
  });

  it("Should not render modal if is modal variant and application is loading", () => {
    defaultProps.asModal = true;
    defaultProps.isModalVisible = true;
    defaultProps.isLoading = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    expect(result.queryByTestId("connect-wallet-modal")).toBeNull();
  });

  it("Should not render modal if is modal variant and wallet is connected", () => {
    defaultProps.asModal = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>, {
                            wrapper: i18NextProviderTests
                          });
    expect(result.queryByTestId("connect-wallet-modal")).toBeNull();
  });
});