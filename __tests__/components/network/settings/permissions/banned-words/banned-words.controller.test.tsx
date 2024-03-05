import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react";

import BannedWords from "components/network/settings/permissions/banned-words/banned-words.controller";

import { Network } from "interfaces/network";

import { CreateBannedWord, RemoveBannedWord } from "x-hooks/api/marketplace/management/banned-words";

import { mockAddSuccess } from "__mocks__/x-hooks/stores/toasts/toasts.store";

import { render } from "__tests__/utils/custom-render";
jest.mock("x-hooks/api/marketplace/management/banned-words", () => ({
  CreateBannedWord: jest.fn(),
  RemoveBannedWord: jest.fn(),
}));

const testDomain = "domain.com";
describe("BannedWords", () => {
  let queryClient;
  let mockNetwork;

  beforeEach(() => {
    queryClient = new QueryClient();
    mockNetwork = {
      id: 1,
      name: "network",
      networkAddress: "0x123456",
      chain_id: 1,
      banned_domains: []
    } as unknown as Network;
    jest.clearAllMocks();
  });

  it("Should add banned word successfully", async () => {
    const mockSetState = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [jest.fn((translationKey) => translationKey), jest.fn()])
      .mockImplementationOnce(() => [testDomain, mockSetState]);

    const result = render(<QueryClientProvider client={queryClient}>
      <BannedWords network={mockNetwork} />
    </QueryClientProvider>);

    const input = result.getByTestId(`banned-word-input`);
    fireEvent.change(input, { target: { value: testDomain } });
    const button = result.getByTestId(`banned-word-btn`);
    fireEvent.click(button);

    expect(CreateBannedWord)
      .toHaveBeenCalledWith({
        networkId: mockNetwork.id,
        banned_domain: testDomain,
        networkAddress: mockNetwork.networkAddress,
      });
    expect(mockSetState).toHaveBeenCalled();
    expect(mockAddSuccess).toHaveBeenCalled();
  });

  it("Should remove banned word successfully", async () => {
    const mockSetState = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [jest.fn((translationKey) => translationKey), jest.fn()])
      .mockImplementationOnce(() => [testDomain, mockSetState]);

    const mockNetworkWithDomain = {
      ...mockNetwork,
      banned_domains: [testDomain]
    };

    const result = render(<QueryClientProvider client={queryClient}>
      <BannedWords network={mockNetworkWithDomain} />
    </QueryClientProvider>);

    const input = result.getByTestId("banned-word-input");
    fireEvent.change(input, { target: { value: testDomain } });
    const button = result.getByTestId(`permission-trash-btn-${testDomain}`);
    fireEvent.click(button);

    expect(RemoveBannedWord)
      .toHaveBeenCalledWith({
        networkId: mockNetwork.id,
        banned_domain: testDomain,
        networkAddress: mockNetwork.networkAddress,
      });
    expect(mockSetState).toHaveBeenCalled();
    expect(mockAddSuccess).toHaveBeenCalled();
  });
});