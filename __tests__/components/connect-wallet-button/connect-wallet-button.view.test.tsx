import "@testing-library/jest-dom";

import ConnectWalletButtonView from "components/connections/connect-wallet-button/connect-wallet-button.view";

import { render } from "__tests__/utils/custom-render";

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
                          </ConnectWalletButtonView>);
    expect(result.queryByRole("button")).toBeVisible();
    expect(result.queryByTestId("address")).toBeNull();
  });

  it("Should render button with responsive labels", () => {
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>);
    const button = result.queryByRole("button");
    const desktopLabel = button.firstChild.lastChild;
    expect(desktopLabel.textContent).toBe("Connect Wallet");
  });

  it("Should render children if wallet is connected", () => {
    defaultProps.isConnected = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                            <span data-testid="address">address</span>
                          </ConnectWalletButtonView>);
    expect(result.queryByRole("button")).toBeNull();
    expect(result.queryByTestId("address").textContent).toBe("address");
  });

  it("Should render modal if is modal variant and wallet is not connected", () => {
    defaultProps.asModal = true;
    defaultProps.isModalVisible = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>);
    expect(result.queryByTestId("connect-wallet-modal")).toBeVisible();
  });

  it("Should not render modal if is modal variant and application is loading", () => {
    defaultProps.asModal = true;
    defaultProps.isModalVisible = true;
    defaultProps.isLoading = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>);
    expect(result.queryByTestId("connect-wallet-modal")).toBeNull();
  });

  it("Should not render modal if is modal variant and wallet is connected", () => {
    defaultProps.asModal = true;
    const result = render(<ConnectWalletButtonView
                            {...defaultProps}
                          >
                          </ConnectWalletButtonView>);
    expect(result.queryByTestId("connect-wallet-modal")).toBeNull();
  });
});