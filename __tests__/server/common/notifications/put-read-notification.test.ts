import {simpleContextMock, simpleQueryMock} from "../../../../__mocks__/requests/simple-mock";
import models from "../../../../db/models";
import {putReadNotification} from "../../../../server/common/notifications/put-read-notification";
import {HttpBadRequestError, HttpNotFoundError, HttpUnauthorizedError} from "../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  notification: {
    findAll: jest.fn().mockReturnValue([{mock: "notification", userId: "1", update: jest.fn().mockReturnValue(true)}]),
  }
}));

describe("putReadNotification()", () => {
  it("throws because no userId", async () => {
    await expect(() => putReadNotification({...simpleContextMock(), ...simpleQueryMock()}))
      .rejects
      .toThrow(HttpUnauthorizedError)
  })

  it("throws because id is NaN", async () => {
    await expect(() => putReadNotification({...simpleContextMock(undefined, "1"), ...simpleQueryMock("", NaN)}))
      .rejects
      .toThrow(HttpBadRequestError)
  })

  it("throws because id is undefined", async () => {
    await expect(() => putReadNotification({...simpleContextMock(undefined, "1"), ...simpleQueryMock("", "")}))
      .rejects
      .toThrow(HttpBadRequestError)
  })

  it("throws because 'read' is not 'true' or 'false'", async () => {
    await expect(() =>
      putReadNotification({
        ...simpleContextMock(undefined, "1"),
        ...simpleQueryMock("", "1", undefined, "neither")}))
      .rejects
      .toThrow(HttpBadRequestError)
  })

  it("calls model.update", async () => {
    expect(await putReadNotification({
      ...simpleContextMock(undefined, "1"),
      ...simpleQueryMock("", "1", undefined, "true")}))
      .toBe(true)
  })

  it("throws because not found", async () => {
    models.notification.findAll.mockReturnValue([]);
    await expect(() =>
      putReadNotification({
        ...simpleContextMock(undefined, "1"),
        ...simpleQueryMock("", "1", undefined, "true")}))
      .rejects
      .toThrow(HttpNotFoundError)
  })
})