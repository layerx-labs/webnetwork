import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react";

import VotingPowerPage from "components/profile/pages/voting-power/controller";

import { chain1, network1 } from "__mocks__/x-hooks/use-supported-chain";

import { render } from "__tests__/utils/custom-render";

const mockStartService = jest.fn();
jest.mock("x-hooks/use-dao", () => ({
  useDao: () => ({
    start: mockStartService
  })
}));

const defaultAddress = "0x123456";
const defaultNetworkAddress = "0x123456";
const mockActiveMarketplace = {
  chain_id: 1,
  networkAddress: defaultNetworkAddress
};

const currentUser = {
  walletAddress: defaultAddress
};

const mockMarketplaceClear = jest.fn();
jest.mock("x-hooks/use-marketplace", () => () => ({
  active: mockActiveMarketplace,
  clear: mockMarketplaceClear
}));

jest.mock("x-hooks/stores/user/user.store", () => ({
  useUserStore: () => ({
    currentUser
  })
}));

const mockMarketplaceUpdate = jest.fn();
jest.mock("x-hooks/stores/marketplace/use-marketplace.store", () => ({
  useMarketplaceStore: () => ({
    update: mockMarketplaceUpdate
  })
}));

jest.mock("components/profile/pages/voting-power/network/controller", () => {
  return {
    __esModule: true,
    default: jest.fn((props) => (
      <div>
      </div>
    )),
  };
});

jest.mock("components/profile/profile-layout", () => {
  return {
    __esModule: true,
    default: jest.fn((props) => (
      <div>
        {props?.children}
      </div>
    )),
  };
});

const mockSetSelectedNetwork = jest.fn();
const mockSetSelectedChain = jest.fn();

describe("VotingPowerPage", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it("Should clear active marketplace and update selectedNetwork when marketplace is selected", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [null, mockSetSelectedNetwork])
      .mockImplementationOnce(() => [null, mockSetSelectedChain]);

    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const select = result.getByTestId("marketplace-filter").firstChild.firstChild;
    fireEvent.focus(select);
    fireEvent.keyDown(select, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("network1"));
    expect(mockMarketplaceClear).toHaveBeenCalled();
    expect(mockSetSelectedNetwork).toHaveBeenCalledWith(network1);
  });

  it("Should clear active marketplace and update selectedChain when network is selected", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [null, mockSetSelectedNetwork])
      .mockImplementationOnce(() => [null, mockSetSelectedChain]);

    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const select = result.getByTestId("chain-filter").firstChild.firstChild;
    fireEvent.focus(select);
    fireEvent.keyDown(select, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("chain1"));
    expect(mockMarketplaceClear).toHaveBeenCalled();
    expect(mockSetSelectedChain).toHaveBeenCalledWith(chain1);
  });

  it("Should clear active marketplace and selectedNetwork when clear button is clicked", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [null, mockSetSelectedNetwork])
      .mockImplementationOnce(() => [null, mockSetSelectedChain]);

    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const select = result.getByTestId("marketplace-filter").firstChild.firstChild;
    fireEvent.focus(select);
    fireEvent.keyDown(select, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("network1"));
    fireEvent.mouseDown(result.getByTestId("react-select-clear-indicator").firstChild);
    expect(mockMarketplaceClear).toHaveBeenCalled();
    expect(mockSetSelectedNetwork).toHaveBeenCalledWith(null);
  });

  it("Should clear active marketplace and selectedChain when clear button is clicked", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [null, mockSetSelectedNetwork])
      .mockImplementationOnce(() => [null, mockSetSelectedChain]);

    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const select = result.getByTestId("chain-filter").firstChild.firstChild;
    fireEvent.focus(select);
    fireEvent.keyDown(select, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("chain1"));
    fireEvent.mouseDown(result.getByTestId("react-select-clear-indicator").firstChild);
    expect(mockMarketplaceClear).toHaveBeenCalled();
    expect(mockSetSelectedChain).toHaveBeenCalledWith(null);
  });

  it("Should display only chains available for the selected marketplace", async () => {
    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const marketplaceSelect = result.getByTestId("marketplace-filter").firstChild.firstChild;
    fireEvent.focus(marketplaceSelect);
    fireEvent.keyDown(marketplaceSelect, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("network2"));
    expect(result.queryByText("chain1")).toBeNull();
  });

  it("Should display only marketplaces available for the selected chain", async () => {
    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const chainSelect = result.getByTestId("chain-filter").firstChild.firstChild;
    fireEvent.focus(chainSelect);
    fireEvent.keyDown(chainSelect, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("chain1"));
    expect(result.queryByText("network2")).toBeNull();
  });

  it("Should not update active marketplace and call start service because only marketplace is selected", async () => {
    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const select = result.getByTestId("marketplace-filter").firstChild.firstChild;
    fireEvent.focus(select);
    fireEvent.keyDown(select, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("network1"));
    expect(mockMarketplaceUpdate).not.toHaveBeenCalled();
    expect(mockStartService).not.toHaveBeenCalled();
  });

  it("Should not update active marketplace and call start service because only network is selected", async () => {
    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const select = result.getByTestId("chain-filter").firstChild.firstChild;
    fireEvent.focus(select);
    fireEvent.keyDown(select, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("chain1"));
    expect(mockMarketplaceUpdate).not.toHaveBeenCalled();
    expect(mockStartService).not.toHaveBeenCalled();
  });

  it("Should update marketplace and start service when marketplace and network are selected", async () => {
    const result = render(<QueryClientProvider client={queryClient}><VotingPowerPage /></QueryClientProvider>);
    const marketplaceSelect = result.getByTestId("marketplace-filter").firstChild.firstChild;
    fireEvent.focus(marketplaceSelect);
    fireEvent.keyDown(marketplaceSelect, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("network1"));
    const chainSelect = result.getByTestId("chain-filter").firstChild.firstChild;
    fireEvent.focus(chainSelect);
    fireEvent.keyDown(chainSelect, {
      key: "ArrowDown",
      code: 40,
    });
    fireEvent.click(result.getByText("chain1"));
    expect(mockMarketplaceUpdate).toHaveBeenCalledWith({
      active: network1
    });
    expect(mockStartService).toHaveBeenCalledWith({
      chainId: chain1.chainId,
      networkAddress: network1.networkAddress
    });
  });
});