import {UserRole} from "../../interfaces/enums/roles";

export const simpleContextMock = (roles = [UserRole.USER],
                           userId = "0",
                           address = "0x1") =>
  ({body: {context: {token: {roles}, user: {id: userId, address}}}}) as any;

export const simpleQueryMock = (address = "0x1", id = "", page = undefined, read = undefined) =>
  ({query: {address, id, page, read}}) as any;