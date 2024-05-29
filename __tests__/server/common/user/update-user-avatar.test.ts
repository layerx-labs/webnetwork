import { NextApiRequest } from "next";

import IpfsStorage from "services/ipfs-service";

import { updateUserAvatar } from "server/common/user/update-user-avatar";
import { HttpBadRequestError } from "server/errors/http-errors";

jest
  .mock("services/ipfs-service", () => ({
    add: jest.fn().mockResolvedValue({ hash: "hash" }),
  }));

jest
  .mock("services/logging", () => ({ 
    Logger: {
      error: jest.fn()
    }
  }));

jest
  .mock('server/utils/points-system/add-point-entry', () => ({
    addPointEntry: jest.fn().mockResolvedValue("")
  }));

describe("UpdateUserAvatar", () => {
  let mockRequest: NextApiRequest;

  beforeEach(() => {
    mockRequest = {
      body: {
        files: [
          {
            fileName: "avatar.png",
            fileData: "data:image/png,sadF#2fasdFQfqefasdf",
          }
        ],
        context: {
          user: {
            avatar: null,
            save: jest.fn(),
          }
        }
      },
    } as unknown as NextApiRequest;
  });

  it("Should update user avatar successfully", async () => {
    await updateUserAvatar(mockRequest);

    expect(IpfsStorage.add).toHaveBeenCalled();
    expect(mockRequest.body.context.user.avatar).toBe("hash");
    expect(mockRequest.body.context.user.save).toHaveBeenCalled();
  });

  it("Should throw because no files were provided", async () => {
    mockRequest.body.files = null;
    await expect(() => updateUserAvatar(mockRequest))
      .rejects
      .toBeInstanceOf(HttpBadRequestError);
    
    mockRequest.body.files = [];
    await expect(() => updateUserAvatar(mockRequest))
      .rejects
      .toBeInstanceOf(HttpBadRequestError);
  });

  it("Should throw because file type is invalid", async () => {
    mockRequest.body.files = [
      {
        fileName: "avatar.svg",
        fileData: "data:image/svg,sadF#2fasdFQfqefasdf",
      }
    ];
    await expect(() => updateUserAvatar(mockRequest))
      .rejects
      .toBeInstanceOf(HttpBadRequestError);
  });
});