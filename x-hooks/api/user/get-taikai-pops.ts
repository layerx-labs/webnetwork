import {api} from "services/api";

import {AnkrNftAsset} from "types/ankr-nft-asset";

export const getTaikaiPops = (address: string) =>
  api.get<AnkrNftAsset[]>(`/user/${address}/taikai-pop`)
    .then(({data}) => {
      return data;
    })
    .catch(e => {
      console.log(`Error fetching pops`, e);
      return []
    })