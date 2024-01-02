import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react";

import AllowList from "components/network/settings/permissions/allow-list/allow-list.controller";

import { AllowListTypes } from "interfaces/enums/marketplace";

import useAddAllowListEntry from "x-hooks/api/marketplace/management/allow-list/use-add-allow-list-entry";
import useDeleteAllowListEntry from "x-hooks/api/marketplace/management/allow-list/use-delete-allow-list-entry";

import { isAddress } from "__mocks__/web3-utils";
import { mockAddSuccess } from "__mocks__/x-hooks/stores/toasts/toasts.store";

import { render } from "__tests__/utils/custom-render";

const networkId = 1;
const networkAddress = "0x1234";
const address = "0x194EA394D10e014D79dB10607ACFCAfF299d0dfa";
const type = AllowListTypes.OPEN_TASK;

jest
  .mock("x-hooks/api/marketplace/management/allow-list/use-add-allow-list-entry", () => jest.fn(() => ([])));
jest
  .mock("x-hooks/api/marketplace/management/allow-list/use-delete-allow-list-entry", () => jest.fn(() => ([])));
jest
  .mock("x-hooks/api/marketplace/management/allow-list/use-get-allow-list", () => jest.fn(() => ([])));

describe("AllowList", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  it("Should add address to list", async () => {
    const mockSetState = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [jest.fn((translationKey) => translationKey), jest.fn()])
      .mockImplementationOnce(() => [address, mockSetState]);
    const result = render(<QueryClientProvider client={queryClient}>
      <AllowList
        networkId={networkId}
        networkAddress={networkAddress}
        type={AllowListTypes.OPEN_TASK}
      />
    </QueryClientProvider>);
    const input = result.getByTestId("permission-input");
    fireEvent.change(input, { target: { value: address } });
    const button = result.getByTestId("permission-add-button");
    fireEvent.click(button);
    expect(useAddAllowListEntry).toHaveBeenCalledWith(networkId, address, networkAddress, type);
    expect(mockAddSuccess).toHaveBeenCalled();
    expect(mockSetState).toHaveBeenCalledWith("");
  });

  it("Should remove address from list", async () => {
    const mockUseGetAllowList = jest.requireMock("x-hooks/api/marketplace/management/allow-list/use-get-allow-list");
    mockUseGetAllowList
      .mockImplementationOnce(() => ([address]));
    const result = render(<QueryClientProvider client={queryClient}>
      <AllowList
        networkId={networkId}
        networkAddress={networkAddress}
        type={AllowListTypes.OPEN_TASK}
      />
    </QueryClientProvider>);

    const removeButton = result.getByTestId(`permission-item-button-${address}`);
    fireEvent.click(removeButton);
    expect(useDeleteAllowListEntry).toHaveBeenCalledWith(networkId, address, type);
    expect(mockAddSuccess).toHaveBeenCalled();
  });

  it("Should disable add button because address is invalid", async () => {
    isAddress
      .mockReturnValue(false);
    const result = render(<QueryClientProvider client={queryClient}>
      <AllowList
        networkId={networkId}
        networkAddress={networkAddress}
        type={AllowListTypes.OPEN_TASK}
      />
    </QueryClientProvider>);

    const input = result.getByTestId("permission-input");
    fireEvent.change(input, { target: { value: "invalid-address" } });
    const button = result.getByTestId("permission-add-button");
    expect(button).toBeDisabled();
  });
});