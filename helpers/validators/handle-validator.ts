export function handleValidator(handle: string) {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}[a-zA-Z0-9]$/.test(handle)
}