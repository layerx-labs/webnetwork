const useUpdateUserSettings = jest.fn(async (settings: {
  notifications?: boolean;
  language?: string;
}) => {
  return {};
});

export {
  useUpdateUserSettings
};