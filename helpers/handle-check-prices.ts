import {lowerCaseCompare} from "./string";

export function handleResultTokens(queryTokens, priceDbTokens) {
  return queryTokens
    .map(({address, chainId}) =>
      priceDbTokens.find(({chain_id: cid, address: a}) =>
        lowerCaseCompare(address, a) && +chainId === cid))
    .filter(v => !!v)
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