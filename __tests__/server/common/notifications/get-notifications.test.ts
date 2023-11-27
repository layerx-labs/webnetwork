import {UserRole} from "../../../../interfaces/enums/roles";
import {getNotifications} from "../../../../server/common/notifications/get-notifications";
import {HttpBadRequestError, HttpUnauthorizedError} from "../../../../server/errors/http-errors";

jest.mock("db/models", () => ({
  notification: {
    findAll: jest.fn().mockReturnValue([{mock: "notification"}])
  }
}));

const simpleContextMock = (roles = [UserRole.USER],
                           userId = "0",
                           address = "0x1") =>
  ({body: {context: {token: {roles}, user: {id: userId, address}}}}) as any;

const simpleQueryMock = (address = "0x1", id = "", page = undefined, read = undefined) =>
  ({query: {address, id, page, read}}) as any;

const mockAddress = "0xf15CC0ccBdDA041e2508B829541917823222F364";
const mockAddress_2 = "0xF33323fCe7d8878698781F33680fd24C7FEfbBba";

describe("getNotifications()", () => {

  describe("@Throws", () => {
    it("Throws because no userId", async () => {
      expect(() => getNotifications({
        ...simpleContextMock(),
        ...simpleQueryMock("0x1", "2")}))
        .toThrow(HttpUnauthorizedError)
    })

    it("Throws because no admin trying to read other address notifications", async () => {
      expect(() => getNotifications({
        ...simpleContextMock(),
        ...simpleQueryMock("0x2")}))
        .toThrow(HttpUnauthorizedError)
    })

    it("Throws because no query.id and no query.address", async () => {
      expect(() => getNotifications({
        ...simpleContextMock(undefined, "1"),
        ...simpleQueryMock("")}))
        .toThrow(HttpBadRequestError)
    })

    /** This tests that the owner can get their notifications as a side-effect */
    it("Throws because '0x1' is not an address", async () => {
      expect(() => getNotifications({
        ...simpleContextMock(undefined, "1"),
        ...simpleQueryMock("0x1")}))
        .toThrow(HttpBadRequestError)
    })

    it("Throws because query.id isNaN", async () => {
      expect(() => getNotifications({
        ...simpleContextMock(undefined, "1"),
        ...simpleQueryMock("", NaN as any)}))
        .toThrow(HttpBadRequestError)
    })

    it("Throws because query.read is not 'true' or 'false'", async () => {
      expect(() => getNotifications({
        ...simpleContextMock(undefined, "2"),
        ...simpleQueryMock("", "2", undefined, "neither")}))
        .toThrow(HttpBadRequestError)
    })
  })

  describe("isAdmin = true", () => {
    it("Admin searches for their notifications", async () => {
      expect(await getNotifications({
        ...simpleContextMock([UserRole.ADMIN], "1", mockAddress),
        ...simpleQueryMock(mockAddress)}))
        .toEqual([{mock: "notification"}]);
    })

    it("Admin searches for another users notifications", async () => {
      expect(await getNotifications({
        ...simpleContextMock([UserRole.ADMIN], "1", mockAddress),
        ...simpleQueryMock(mockAddress_2)}))
        .toEqual([{mock: "notification"}]);
    })

    it("Admin searches for another user id", async () => {
      expect(await getNotifications({
        ...simpleContextMock([UserRole.ADMIN], "1", mockAddress),
        ...simpleQueryMock("", "2")}))
        .toEqual([{mock: "notification"}]);
    })

  });
  describe("isAdmin = false", () => {

    it("User searches for their notifications", async () => {
      expect(await getNotifications({
        ...simpleContextMock(undefined, "1", mockAddress),
        ...simpleQueryMock(mockAddress)}))
        .toEqual([{mock: "notification"}]);
    });

    it("User searches for their notifications using id", async () => {
      expect(await getNotifications({
        ...simpleContextMock(undefined, "2", mockAddress),
        ...simpleQueryMock("", "2")}))
        .toEqual([{mock: "notification"}]);
    });

    it("User searches for their READ notifications", async () => {
      expect(await getNotifications({
        ...simpleContextMock(undefined, "2", mockAddress),
        ...simpleQueryMock(mockAddress, "", undefined, "true")}))
        .toEqual([{mock: "notification"}]);
    });

  });
})