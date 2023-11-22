export const truncateString = (str, limit) =>
  str?.length > limit ? `${str.substring(0, limit)}...` : str;
