export function isValidUrl(url: string) {
  try {
    const urlObject = new URL(url);
    return ["http://", "https://"].includes(`${urlObject.protocol}//`);
  } catch (err) {
    return false;
  }
}
