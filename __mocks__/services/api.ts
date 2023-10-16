export const getMock = jest.fn();
export const postMock = jest.fn();
export const putMock = jest.fn();
export const patchMock = jest.fn();
export const deleteMock = jest.fn();
const apiServiceMock = jest.fn().mockImplementation(() => ({
  get: getMock,
  post: postMock,
  put: putMock,
  patch: patchMock,
  delete: deleteMock
}));
export default apiServiceMock;