const mockSettings = {
  currency: {
    defaultFiat: "usd"
  }
};
export async function loadSettingsFromDb() {
  return mockSettings;
}