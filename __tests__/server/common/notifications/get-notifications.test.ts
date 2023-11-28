import {NextApiRequest} from "next";

import {UserRole} from "../../../../interfaces/enums/roles";
import {getNotifications} from "../../../../server/common/notifications/get-notifications";
import {HttpBadRequestError, HttpUnauthorizedError} from "../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  notification: {
    findAll: jest.fn().mockReturnValue([{mock: "notification"}])
  }
}));

const mockAddress = "0xf15CC0ccBdDA041e2508B829541917823222F364";
const mockAddress_2 = "0xF33323fCe7d8878698781F33680fd24C7FEfbBba";

describe("getNotifications()", () => {

  let mockedRequest: NextApiRequest;

  describe("@Throws", () => {

    beforeEach(() => {
      mockedRequest = {query: {}, body: {context: {token: {roles: []}, user: {id: 1}}}} as NextApiRequest;
    });

    it("Throws because no userId", async () => {
      mockedRequest.body.context.user.id = "";
      mockedRequest.query = {address: "0x1", id: "2"};

      expect(() => getNotifications(mockedRequest))
        .toThrow(HttpUnauthorizedError);
    })

    it("Throws because no admin trying to read other address notifications", async () => {
      mockedRequest.body.context.user.id = "2";
      mockedRequest.query = {address: "0x2"};

      expect(() => getNotifications(mockedRequest))
        .toThrow(HttpUnauthorizedError)
    })

    it("Throws because no query.id and no query.address", async () => {
      expect(() => getNotifications(mockedRequest))
        .toThrow(HttpBadRequestError)
    })

    it("Throws because '0x1' is not an address", async () => {
      mockedRequest.query = {address: "0x1"};
      mockedRequest.body.context.user.address = "0x1";

      expect(() => getNotifications(mockedRequest))
        .toThrow(HttpBadRequestError)
    })

    it("Throws because query.id isNaN", async () => {
      mockedRequest.query = {id: NaN as any};

      expect(() => getNotifications(mockedRequest))
        .toThrow(HttpBadRequestError)
    })

    it("Throws because query.read is not 'true' or 'false'", async () => {
      mockedRequest.query = {id: "2", read: "neither"};
      mockedRequest.body.context.user.id = "2";
      expect(() => getNotifications(mockedRequest))
        .toThrow(HttpBadRequestError)
    })
  })
  describe("isAdmin = true", () => {

    beforeEach(() => {
      mockedRequest = {query: {}, body: {context: {token: {roles: [UserRole.ADMIN]}, user: {id: "1", address: mockAddress}}}} as NextApiRequest;
    });

    it("Admin searches for their notifications", async () => {
      mockedRequest.query = {address: mockAddress};

      expect(await getNotifications(mockedRequest))
        .toEqual([{mock: "notification"}]);
    })

    it("Admin searches for another users notifications", async () => {
      mockedRequest.query = {address: mockAddress_2};

      expect(await getNotifications(mockedRequest))
        .toEqual([{mock: "notification"}]);
    })

    /** this tests the deleteNotification() and putReadNotification() "is admin" part as a side effect */
    it("Admin searches for another user id", async () => {
      mockedRequest.query = {id: "2"};

      expect(await getNotifications(mockedRequest))
        .toEqual([{mock: "notification"}]);
    })

  });
  describe("isAdmin = false", () => {
    beforeEach(() => {
      mockedRequest = {query: {}, body: {context: {token: {roles: [UserRole.USER]}, user: {id: "1", address: mockAddress}}}} as NextApiRequest;
    });

    it("User searches for their notifications", async () => {
      mockedRequest.query = {address: mockAddress};

      expect(await getNotifications(mockedRequest))
        .toEqual([{mock: "notification"}]);
    });

    it("User searches for their notifications using id", async () => {
      mockedRequest.query = {id: "1"};

      expect(await getNotifications(mockedRequest))
        .toEqual([{mock: "notification"}]);
    });

    it("User searches for their READ notifications", async () => {
      mockedRequest.query = {address: mockAddress, read: "true"};

      expect(await getNotifications(mockedRequest))
        .toEqual([{mock: "notification"}]);
    });

  });
})