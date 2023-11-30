import React from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {fireEvent, waitFor} from "@testing-library/react";
import * as nextAuth from 'next-auth/react';

import UserNameForm from "components/profile/user-name-form/controller";

import {useUpdateHandle} from "x-hooks/api/user/use-update-handle";

import {useCheckHandle} from "../../../../x-hooks/api/user/use-check-handle";
import {render} from "../../../utils/custom-render";

jest.mock('next-auth/react');
jest.mock('x-hooks/api/user/use-update-handle');
jest.mock('x-hooks/api/user/use-check-handle');

const mockUseSession =
  nextAuth.useSession as jest.MockedFunction<typeof nextAuth.useSession>;
const mockUseUpdateHandle = useUpdateHandle as jest.MockedFunction<typeof useUpdateHandle>;
const mockUseCheckHandle = useCheckHandle as jest.MockedFunction<typeof useCheckHandle>

describe("UserNameForm", () => {
  let queryClient;

  beforeEach(() => {
    // Initializing QueryClient
    queryClient = new QueryClient();

    // Mocking the implementations
    (mockUseSession as jest.Mock).mockReturnValue({
      data: { user: { login: "TestUser", address: "TestAddress" } },
      update: jest.fn()
    });
    jest.clearAllMocks();
  });

  it("should update user handle", async () => {

    const { container, getByText } = render(<QueryClientProvider client={queryClient}>
        <UserNameForm />
      </QueryClientProvider>);

    const button = container.querySelector(".btn");
    fireEvent.click(button);

    const input = container.querySelector(".user-input input");
    fireEvent.change(input, { target: { value: "NewUser" } });

    mockUseCheckHandle.mockResolvedValue(false);
    
    await waitFor(() => {
      expect(mockUseCheckHandle).toHaveBeenCalledWith("NewUser")
    });

    const buttonSave = getByText('Save');
    fireEvent.click(buttonSave);

    mockUseUpdateHandle.mockResolvedValue({address: "TestAddress", handle: "NewUser"})

    await waitFor(() => {
      expect(mockUseUpdateHandle).toHaveBeenCalledWith(({address: "TestAddress", handle: "NewUser"}))
    });

  });

  it("should check user handle is invalid", async () => {
    const { container, getByText } = render(<QueryClientProvider client={queryClient}>
        <UserNameForm />
      </QueryClientProvider>);

    const button = container.querySelector(".btn");
    fireEvent.click(button);

    const input = container.querySelector(".user-input input");
    fireEvent.change(input, { target: { value: "invalidName" } });

    mockUseCheckHandle.mockResolvedValue(true);
    
    await waitFor(() => {
      expect(mockUseCheckHandle).toHaveBeenCalledWith("invalidName")
    });

    const buttonSave = getByText('Save')

    expect(buttonSave).toBeDisabled();
  });

  it("should check handleValidator", async () => {
    const { container, getByText } = render(<QueryClientProvider client={queryClient}>
        <UserNameForm />
      </QueryClientProvider>);

    const button = container.querySelector(".btn");
    fireEvent.click(button);

    const input = container.querySelector(".user-input input");
    fireEvent.change(input, { target: { value: "@invalidName" } });
    
    const buttonSave = getByText('Save')

    await waitFor(() => {
      expect(buttonSave).toBeDisabled();
    });
  });
});