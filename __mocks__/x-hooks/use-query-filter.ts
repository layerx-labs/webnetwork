import { QueryParams } from "types/utils";

export default function (params: QueryParams) {
  return {
    value: {},
    setValue: jest.fn(),
    apply: jest.fn(),
  }
}