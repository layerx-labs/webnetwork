import {NextApiRequest} from "next";

import models from "../../../../db/models";
import {markNotificationRead} from "../../../../server/common/notifications/mark-notification-read";
import {HttpBadRequestError, HttpNotFoundError, HttpUnauthorizedError} from "../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  notification: {
    findAll: jest.fn().mockReturnValue([{mock: "notification", userId: "1", update: jest.fn().mockReturnValue(true)}]),
  }
}));

describe("markNotificationRead()", () => {
  let mockedRequest: NextApiRequest;

  beforeEach(() => {
    mockedRequest = {query: {}, body: {context: {token: {roles: []}, user: { id: "1"}}}} as NextApiRequest;
  });

  it("throws because no userId", async () => {
    mockedRequest.body.context.user.id = "";
    await expect(() => markNotificationRead(mockedRequest))
      .rejects
      .toThrow(HttpUnauthorizedError)
  })

  it("throws because id is NaN", async () => {
    mockedRequest.query = {id: NaN as any};
    await expect(() => markNotificationRead(mockedRequest))
      .rejects
      .toThrow(HttpBadRequestError)
  })

  it("throws because id is undefined", async () => {
    await expect(() => markNotificationRead(mockedRequest))
      .rejects
      .toThrow(HttpBadRequestError)
  })

  it("throws because 'read' is not 'true' or 'false'", async () => {
    mockedRequest.query = {id: "1", read: "neither"};

    await expect(() =>
      markNotificationRead(mockedRequest))
      .rejects
      .toThrow(HttpBadRequestError)
  })

  it("calls model.update", async () => {
    mockedRequest.query = {id: "1", read: "true"};

    expect(await markNotificationRead(mockedRequest))
      .toBe(true)
  })

  it("throws because not found", async () => {
    models.notification.findAll.mockReturnValue([]);
    mockedRequest.query = {id: "1", read: "true"};

    await expect(() =>
      markNotificationRead(mockedRequest))
      .rejects
      .toThrow(HttpNotFoundError)
  })
})