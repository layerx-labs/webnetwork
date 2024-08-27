export function stringifyArrayValues(obj: object) {
  const result = { ...obj };

  for (const key in result) {
    if (Array.isArray(result[key]))
      result[key] = { array_data: JSON.stringify(result[key]) };
    else if (typeof result[key] === "object")
      result[key] = stringifyArrayValues(result[key]);
  }

  return result
}
