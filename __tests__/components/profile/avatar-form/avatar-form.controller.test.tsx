import React from "react";

import {fireEvent, waitFor} from "@testing-library/dom";
import {useSession} from "next-auth/react";

import {AvatarForm} from "components/profile/avatar-form/avatar-form.controller";

import {useUpdateUserAvatar} from "x-hooks/api/user/use-update-user-avatar";

import {render} from "__tests__/utils/custom-render";

jest
  .mock("next-auth/react", () => ({
    useSession: jest.fn().mockReturnValue({
      update: jest.fn()
    })
  }));

jest
  .mock("x-hooks/stores/user/user.store", () => ({
    useUserStore: jest.fn().mockReturnValue({
      currentUser: {
        walletAddress: "0x000000000",
      },
    })
  }))

jest
  .mock("x-hooks/api/user/use-update-user-avatar", () => ({
    useUpdateUserAvatar: jest.fn(),
  }));

describe("AvatarForm", () => {
  const avatarFile = new File(["avatar"], "avatar.png", { type: "image/png" });
  const formData = new FormData();

  formData.append("file", avatarFile)

  window.URL.createObjectURL = jest.fn().mockReturnValue("url");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should change user avatar", async () => {
    const result = render(<AvatarForm />);

    const editButton = result.getByTestId("user-edit-icon-btn");
    await fireEvent.click(editButton);

    const avatarInput = result.getByTestId("Avatar");

    await waitFor(() => {
      fireEvent.change(avatarInput, {
        target: { files: [avatarFile] },
      });
    });

    const saveButton = result.getByTestId("update-avatar-button");
    await fireEvent.click(saveButton);

    expect(useSession().update).toHaveBeenCalled();
    expect(useUpdateUserAvatar)
      .toHaveBeenCalledWith({
        address: "0x000000000",
        form: formData
      });
  });
});