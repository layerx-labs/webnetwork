import { QueryParams } from "types/utils";

export const mockSetValue = jest.fn();
export const mockApply = jest.fn();

export default function useQueryFilter (params: QueryParams) {
  return {
    value: {},
    setValue: mockSetValue,
    apply: mockApply,
  }
}