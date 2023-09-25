export function isValidUrl(url: string) {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch (err) {
    return false;
  }
}

export function isHttps(url: string) {
  return url?.includes("https://");
}