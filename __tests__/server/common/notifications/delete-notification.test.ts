import models from "db/models";

import {simpleContextMock, simpleQueryMock} from "../../../../__mocks__/requests/simple-mock";
import {deleteNotification} from "../../../../server/common/notifications/delete-notification";
import {HttpNotFoundError, HttpUnauthorizedError} from "../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  notification: {
    findAll: jest.fn().mockReturnValue([{mock: "notification", userId: "1", update: jest.fn().mockReturnValue(true)}]),
  }
}));

describe("deleteNotification()", () => {
  it("throws because no userId", async () => {
    await expect(() => deleteNotification({...simpleContextMock(), ...simpleQueryMock()}))
      .rejects
      .toThrow(HttpUnauthorizedError);
  });

  it("throws because notification does not belong to user", async () => {
    await expect(() => deleteNotification({...simpleContextMock(undefined, "1"), ...simpleQueryMock("", "2")}))
      .rejects
      .toThrow(HttpUnauthorizedError);
  });

  it("calls model.update", async () => {
    expect(await deleteNotification({...simpleContextMock(undefined, "1"), ...simpleQueryMock("", "1")})).toBe(true);
  })

  it("throws because not found", async () => {
    models.notification.findAll.mockReturnValue([]);
    await expect(() => deleteNotification({...simpleContextMock(undefined, "1"), ...simpleQueryMock("", "1")}))
      .rejects
      .toThrow(HttpNotFoundError)
  })
})