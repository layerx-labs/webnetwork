export function handleResultTokens(queryTokens, priceDbTokens) {
  const resultTokens = []
  for (const token of queryTokens) {
    const result = priceDbTokens.find((t) =>
          t.address.toLowerCase() === token.address.toLowerCase() &&
          +token.chainId === t.chain_id);
    if (result) resultTokens.push(result?.last_price_used);
    else resultTokens.push('token not found')
  }

  return resultTokens
}

export function findTokenWithOldestUpdatedAt(tokens) {
  if (tokens.length === 0) {
    return null;
  }
  
  return tokens.reduce((oldestToken, currentToken) => {
    if (!currentToken.last_price_used) {
      return oldestToken;
    }
  
    if (!oldestToken || !oldestToken.last_price_used) {
      return currentToken;
    }
  
    const oldestDate = new Date(oldestToken.last_price_used.updatedAt);
    const currentDate = new Date(currentToken.last_price_used.updatedAt);
  
    if (currentDate < oldestDate) {
      return currentToken;
    } else {
      return oldestToken;
    }
  }, null);
}