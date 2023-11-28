import {handleValidator} from "helpers/validators/handle-validator";

describe('handleValidator', () => {
  it('should return true for a valid handle', () => {
    const validHandles = ['validHandle', 'another-Valid-Handle', 'handle123'];
    validHandles.forEach((handle) => {
      expect(handleValidator(handle)).toBe(true);
    });
  });

  it('should return false for an invalid handle', () => {
    const invalidHandles = [
      '', // empty handle
      '-invalidHandle', // starts with a hyphen
      'invalidHandle-', // ends with a hyphen
      'in valid', // contains a space
      'handle@123', // contains special characters
      'tooLongHandle1234567890123456789012345678901234567890', // exceeds 39 characters
    ];
    invalidHandles.forEach((handle) => {
      expect(handleValidator(handle)).toBe(false);
    });
  });
});