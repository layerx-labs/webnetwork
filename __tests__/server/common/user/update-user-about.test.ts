import {NextApiRequest} from "next";

import {updateUserAbout} from "server/common/user/update-user-about";
import {HttpBadRequestError} from "server/errors/http-errors";

jest.mock('server/utils/jwt', () => ({
  UserRoleUtils: {
    hasAdminRole: jest.fn(),
  },
}));

jest.mock('db/models', () => ({
  pointsEvents: {
    findOne: jest.fn(),
  },
}));

jest.mock('server/common/user/get-user-by-address', () => ({getUserByAddress: jest.fn()}));
jest.mock('services/logging', () => ({Logger: jest.fn()}));
jest.mock('server/utils/points-system/add-point-entry', () => ({addPointEntry: jest.fn().mockResolvedValue("")}));
jest.mock('server/utils/points-system/remove-point-entry', () => ({removePointEntry: jest.fn().mockResolvedValue("")}));

describe('updateUserAbout', () => {
  let mockRequest: NextApiRequest;

  beforeEach(() => {
    mockRequest = {
      query: {address: "0x0"},
      body: {
        context: {
          user: {
            update: jest.fn(),
            save: jest.fn(),
          }
        }
      },
    } as unknown as NextApiRequest;
  })

  it("Fails because no `about` on body", async () => {
    await expect(updateUserAbout(mockRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it("Fails because no `body.about` > 512 throws", async () => {
    mockRequest.body.about = Array(514).join("a");
    await expect(updateUserAbout(mockRequest)).rejects.toThrow(HttpBadRequestError);
  });

  it("Succeeds with `body.about` empty string", async () => {
    mockRequest.body.about = "";
    await updateUserAbout(mockRequest);
    expect(mockRequest.body.context.user.update).toHaveBeenCalled();
    expect(mockRequest.body.context.user.save).toHaveBeenCalled();
  });

  it("Succeeds with `body.about` string", async () => {
    mockRequest.body.about = "My about";
    await updateUserAbout(mockRequest);
    expect(mockRequest.body.context.user.update).toHaveBeenCalled();
    expect(mockRequest.body.context.user.save).toHaveBeenCalled();
  });

})