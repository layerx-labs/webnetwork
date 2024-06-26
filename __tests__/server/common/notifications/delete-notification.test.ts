import {NextApiRequest} from "next";
import {v4} from "uuid";

import models from "db/models";

import {deleteNotification} from "../../../../server/common/notifications/delete-notification";
import {HttpNotFoundError, HttpUnauthorizedError} from "../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  notification: {
    findAll: jest.fn().mockReturnValue([{mock: "notification", userId: "1", update: jest.fn().mockReturnValue(true)}]),
  }
}));

describe("deleteNotification()", () => {
  let mockedRequest: NextApiRequest;

  beforeEach(() => {
    mockedRequest = {query: {}, body: {context: {token: {roles: []}, user: { id: 1}}}} as NextApiRequest;
  });

  it("throws because no userId", async () => {
    mockedRequest.body.context.user.id = "";
    await expect(() => deleteNotification(mockedRequest))
      .rejects
      .toThrow(HttpUnauthorizedError);
  });

  it("throws because notification does not belong to user", async () => {
    jest
    .spyOn(models.notification, "findAll")
    .mockImplementationOnce(() => [])

    mockedRequest.body.context.token.roles = ["user"];
    mockedRequest.query = {id: v4()};
    
    await expect(() => deleteNotification(mockedRequest))
      .rejects
      .toThrow(HttpNotFoundError);
  });


  it("calls model.update", async () => {
    mockedRequest.body.context.token.roles = ["user"];
    mockedRequest.body.context.user.id = "1";
    mockedRequest.query = {id: v4()};
    expect(await deleteNotification(mockedRequest)).toBe(true);
  })

  it("throws because not found", async () => {
    models.notification.findAll.mockReturnValue([]);
    mockedRequest.body.context.token.roles = ["user"];
    mockedRequest.body.context.user.id = "1";
    mockedRequest.query = {id: v4()};
    await expect(() => deleteNotification(mockedRequest))
      .rejects
      .toThrow(HttpNotFoundError)
  })
})