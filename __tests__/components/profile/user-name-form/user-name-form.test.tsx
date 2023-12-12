import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {fireEvent, waitFor} from "@testing-library/react";
import * as nextAuth from 'next-auth/react';

import UserNameForm from "components/profile/user-name-form/controller";

import { useCheckHandle } from "__mocks__/x-hooks/api/user/use-check-handle";
import { useUpdateHandle } from "__mocks__/x-hooks/api/user/use-update-handle";

import {render} from "__tests__/utils/custom-render";

jest.mock('next-auth/react');
jest.mock('x-hooks/api/user/use-update-handle');

const mockUseSession =
  nextAuth.useSession as jest.MockedFunction<typeof nextAuth.useSession>;

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

  it("should check user handle is invalid", async () => {
    const { container, getByText } = render(<QueryClientProvider client={queryClient}>
      <UserNameForm />
    </QueryClientProvider>);

    const button = container.querySelector(".btn");
    fireEvent.click(button);

    const input = container.querySelector(".user-input input");
    fireEvent.change(input, { target: { value: "invalidName" } });

    useCheckHandle.mockResolvedValue(true);

    await waitFor(() => {
      expect(useCheckHandle).toHaveBeenCalledWith("invalidName")
    });

    const buttonSave = getByText('Save')

    expect(buttonSave).toBeDisabled();
  });

  it("should update user handle", async () => {

    const { container, getByText } = render(<QueryClientProvider client={queryClient}>
        <UserNameForm />
      </QueryClientProvider>);

    const button = container.querySelector(".btn");
    fireEvent.click(button);

    useCheckHandle.mockResolvedValue(false);

    const input = container.querySelector(".user-input input");
    fireEvent.change(input, { target: { value: "NewUser" } });
    
    await waitFor(() => {
      expect(useCheckHandle).toHaveBeenCalledWith("NewUser")
    });

    const buttonSave = getByText('Save');
    fireEvent.click(buttonSave);

    await waitFor(() => {
      expect(useUpdateHandle).toHaveBeenCalledWith({address: "TestAddress", handle: "NewUser"});
    });

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